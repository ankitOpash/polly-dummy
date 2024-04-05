import models from "src/apollo/server/models"
import { CustomError } from 'src/apollo/server/utils/customError'
import { GENERAL_ERROR, PRODUCT_ATTRIBUTE_ERROR } from 'src/apollo/server/utils/errorMessages'
import { GeneralHelpers } from "src/apollo/server/helpers/GeneralHelpers"

import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import ActivityHelpers from "../../helpers/ActivityHelpers";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const resolvers = {
  Query: {
    getProductAttributes: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
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


        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "productAttributeTbl")
        filterText.company = user.company
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

              // parentCategory: "$parentCategoryDetail",
              // category: "$categoryDetail",
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

        const returnData = await models.ProductAttribute.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

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
    createProductAttribute: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {
        input.name = capitalizeFirstLetter(input?.name) || ''

        const productAttributeWithSameName = await models.ProductAttribute.findOne({
          name: new RegExp('^' + input.name.trim() + '$', 'i'),
          isDeleted: false,
          company: user.company,
        }).lean().exec()

        if (productAttributeWithSameName) {
          throw new CustomError(PRODUCT_ATTRIBUTE_ERROR.ALREADY_EXISTS, 400)
        }

        const productAttribute = await models.ProductAttribute.create({
          name: input.name,
          group: input.group,
          groupName: input.groupName,
          type: input.type,
          catalogType: input.catalogType,
          options: input.options,
          placeHolder: input.placeHolder,
          adminAttributeRef: input.adminAttributeRef,
          ...(input?.parentCategory ? { parentCategory: input?.parentCategory } : {}),
          ...(input?.category ? { category: input?.category } : {}),
          isRequired: input.isRequired,
          isDeleted: false,
          company: user.company,
          createdBy: user?._id,
          modifiedBy: user?._id,
          company: user.company
        })

        return productAttribute

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateProductAttribute: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        input.name = capitalizeFirstLetter(input?.name) || ''
        const productAttribute = await models.ProductAttribute.findOne({ _id: input._id, isDeleted: false, company: user.company, }).lean().exec()
        if (!productAttribute) {
          throw new CustomError(PRODUCT_ATTRIBUTE_ERROR.NOT_FOUND, 400)
        }

        if (productAttribute.name !== input.name.trim()) {
          const productAttributeWithSameName = await models.ProductAttribute.findOne({
            _id: { $ne: productAttribute._id },
            name: new RegExp('^' + input.name.trim() + '$', 'i'),
            isDeleted: false,
            company: user.company,
          }).lean().exec()
          if (productAttributeWithSameName) {
            throw new CustomError(PRODUCT_ATTRIBUTE_ERROR.ALREADY_EXISTS, 400)
          }
        }

        await models.ProductAttribute.updateOne(
          {
            _id: productAttribute._id,
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
              modifiedBy: user?._id,
              company: user.company,
            }
          }
        )

        // ** Get updated data and return
        const returnData = await models.ProductAttribute.findOne({ _id: productAttribute._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    deleteProductAttributes: combineResolvers(isAuthenticated, async (_, { ids }, { user }) => {
      try {

        const productAttributes = await models.ProductAttribute.find({ _id: { $in: ids }, isDeleted: false, company: user.company, })
        if (!(productAttributes && productAttributes.length)) {
          throw new CustomError(PRODUCT_ATTRIBUTE_ERROR.NOT_FOUND, 400)
        }


        let result = await models.ProductAttribute.updateMany({ _id: { $in: productAttributes }, isDeleted: false, company: user.company, }, { isDeleted: true })

        // ** Remove deleted product attributes from product
        await models.Product.updateMany(
          { 'attributes.attrRef': { $in: productAttributes.map(i => i._id.toString()) } },
          {
            $pull: {
              attributes: {
                attrRef: { $in: productAttributes.map(i => i._id.toString()) }
              }
            }
          }
        )

        let deletedCount = result.matchedCount;
        const deletedList = []
        productAttributes?.map((p) => {
          deletedList.push({
            _id: p?._id,
            relatedToText: `${p?.name}`,
            message: ActivityHelpers.message({
              relatedToText: `${p?.name}`,
              messageType: ActivityHelpers.messageTypes.COMPANY_ATTRIBUTES_DELETE
            }),
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: ""
        }

        return true
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

  }
}