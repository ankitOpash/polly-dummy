import models from "src/apollo/server/models"
import { CustomError } from 'src/apollo/server/utils/customError'
import { GENERAL_ERROR, ADMIN_PRODUCT_ATTRIBUTE_ERROR } from 'src/apollo/server/utils/errorMessages'
import { GeneralHelpers } from "src/apollo/server/helpers/GeneralHelpers"
import lodash from 'lodash'


import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"
import ActivityHelpers from "../../helpers/ActivityHelpers"
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter"
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const resolvers = {
  Query: {
    getAdminProductAttributes: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        if (filter.catalogType && filter.catalogType.length) {
          filter['catalogType'] = filter.catalogType
        }

        if (filter.parentCategory && filter.parentCategory.length > 0) {
          filter['parentCategory._id'] = { $in: filter.parentCategory.map(x => (new ObjectId(x))) }
          if (filter.category && filter.category.length > 0) {
            filter['category._id'] = { $in: filter.category.map(x => (new ObjectId(x))) }
          }
        }

        delete filter?.category
        delete filter?.parentCategory

        // console.log('==filter', filter)

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "adminProductAttributeTbl")
        filter = { ...filter, ...filterText }

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            name: "tempAttributeName",
            createdBy: "tempCreatedByUserName",
            group: "group.name",
            parentCategory: "parentCategory.categoryName"
          }

          if (renameSortKey[input?.sort?.key]) sortKey = renameSortKey[input?.sort?.key]
          sort = { [sortKey]: input?.sort?.type }
        }

        const populateQueries = [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdByData"
            }
          },
          {
            $lookup: {
              from: "attribute_groups",
              localField: "group",
              foreignField: "_id",
              as: "groupData"
            }
          },
          {
            $lookup: {
              from: "admin_categories",
              localField: "parentCategory",
              foreignField: "_id",
              as: "parentCategoryDetail"
            }
          },
          {
            $lookup: {
              from: "admin_categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryDetail"
            }
          },
          {
            $addFields: {
              createdBy: { $first: "$createdByData" },
              group: { $first: "$groupData" },

              // category: "$parentCategoryDetail",
              // subCategory: "$categoryDetail",
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
              tempAttributeName: { $toUpper: "$name" },
              tempCreatedByUserName: { $toUpper: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] } },
              parentCategory: {
                $map: {
                  input: '$parentCategory',
                  as: 'parentCategoryId',
                  in: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$parentCategoryDetail',
                          as: 'parentCategoryData',
                          cond: { $eq: ['$$parentCategoryData._id', '$$parentCategoryId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              category: {
                $map: {
                  input: '$category',
                  as: 'categoryId',
                  in: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$categoryDetail',
                          as: 'categoryData',
                          cond: { $eq: ['$$categoryData._id', '$$categoryId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },

          },

        ]

        const returnData = await models.AdminProductAttribute.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    createAdminProductAttribute: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        input.name = capitalizeFirstLetter(input?.name)

        const adminProductAttributeWithSameName = await models.AdminProductAttribute.findOne({
          name: new RegExp('^' + input.name.trim() + '$', 'i'),
          isDeleted: false
        }).lean().exec()

        if (adminProductAttributeWithSameName) {
          throw new CustomError(ADMIN_PRODUCT_ATTRIBUTE_ERROR.ALREADY_EXISTS, 400)
        }

        const adminProductAttribute = await models.AdminProductAttribute.create({
          name: input.name,
          group: input.group,
          groupName: input.groupName,
          type: input.type,
          catalogType: input.catalogType,
          options: input.options,
          placeHolder: input.placeHolder,
          ...(input?.parentCategory ? { parentCategory: input?.parentCategory } : {}),
          ...(input?.category ? { category: input?.category } : {}),
          isRequired: input.isRequired,
          isDeleted: false,
          createdBy: user?._id,
          modifiedBy: user?._id
        })

        return adminProductAttribute

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateAdminProductAttribute: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        input.name = capitalizeFirstLetter(input?.name)
        const adminProductAttribute = await models.AdminProductAttribute.findOne({ _id: input._id, isDeleted: false }).lean().exec()
        if (!adminProductAttribute) {
          throw new CustomError(ADMIN_PRODUCT_ATTRIBUTE_ERROR.NOT_FOUND, 400)
        }

        if (adminProductAttribute.name !== input.name.trim()) {
          const adminProductAttributeWithSameName = await models.AdminProductAttribute.findOne({
            _id: { $ne: adminProductAttribute._id },
            name: new RegExp('^' + input.name.trim() + '$', 'i'),
            isDeleted: false
          }).lean().exec()
          if (adminProductAttributeWithSameName) {
            throw new CustomError(ADMIN_PRODUCT_ATTRIBUTE_ERROR.ALREADY_EXISTS, 400)
          }
        }

        await models.AdminProductAttribute.updateOne(
          {
            _id: adminProductAttribute._id,
          },
          {
            $set: {
              name: input.name,
              group: input.group,
              groupName: input.groupName,
              type: input.type,
              catalogType: input.catalogType,
              options: input.options,
              placeHolder: input.placeHolder,
              ...(input?.parentCategory ? { parentCategory: input?.parentCategory } : {}),
              ...(input?.category ? { category: input?.category } : {}),
              isRequired: input.isRequired,
              modifiedBy: user?._id
            }
          }
        )

        // ** Get updated data and return
        const returnData = await models.AdminProductAttribute.findOne({ _id: adminProductAttribute._id, isDeleted: false }).lean().exec()

        // ** Get list of product attributes added by company
        const productAttributes = await models.ProductAttribute.find({ adminAttributeRef: returnData._id, isDeleted: false }).lean().exec()
        if (productAttributes && productAttributes.length) {
          let promiseArray = []
          productAttributes.forEach((productAttribute) => {
            // ** Update in Product Attribute
            promiseArray.push(
              models.ProductAttribute.updateOne(
                { _id: productAttribute._id },
                {
                  $set: {
                    group: input.group,
                    groupName: input.groupName,
                    type: input.type,
                    catalogType: input.catalogType,
                    options: input.options,
                    placeHolder: input.placeHolder,
                    ...(input?.parentCategory ? { parentCategory: input?.parentCategory } : {}),
                    ...(input?.category ? { category: input?.category } : {}),
                    isRequired: input.isRequired,
                    modifiedBy: user?._id
                  }
                }
              )
            )

          })

          await Promise.all(promiseArray)
        }

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    deleteAdminProductAttributes: combineResolvers(isAuthenticated, async (_, { ids }, { user }) => {
      try {

        let adminProductAttributes = await models.AdminProductAttribute.find({ _id: { $in: ids }, isDeleted: false })
        if (!(adminProductAttributes && adminProductAttributes.length)) {
          throw new CustomError(ADMIN_PRODUCT_ATTRIBUTE_ERROR.NOT_FOUND, 400)
        }

        const productAttributesUsed = await models.ProductAttribute.find({ adminAttributeRef: { $in: adminProductAttributes.map((i) => i._id) }, isDeleted: false }).lean().exec()
        let rejected = productAttributesUsed.map((i) => i.adminAttributeRef?.toString())
        rejected = lodash.uniq(rejected)
        const itemsToBeDeleted = adminProductAttributes.filter((apa) => !rejected.includes(apa._id?.toString()))

        let result = await models.AdminProductAttribute.updateMany({ _id: { $in: itemsToBeDeleted }, isDeleted: false }, { isDeleted: true })

        let deletedCount = result.matchedCount;
        const deletedList = []
        itemsToBeDeleted?.map((item) => {
          deletedList.push({
            _id: item?._id,
            relatedToText: `${item?.name}`,
            message: ActivityHelpers.message({
              relatedToText: `${item?.name}`,
              messageType: ActivityHelpers.messageTypes.ADMIN_ATTRIBUTES_DELETE
            }),
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: rejected && rejected.length ? `${adminProductAttributes.filter((apa) => rejected.includes(apa._id.toString())).map((i) => i.name).join(', ')} - Product attribute in use` : null
        }

        //   return {
        //     deletedCount: result.deletedCount,
        //     deletedAdminProductAttributes: adminProductAttributes,
        //     rejected: rejected,
        //     rejectedMessage: rejected && rejected.length ? `${adminProductAttributes.filter((apa) => rejected.includes(apa._id.toString())).map((i) => i.name).join(', ')} - Product attribute in use` : null
        // }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

  }
}