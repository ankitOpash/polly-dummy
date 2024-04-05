import { combineResolvers } from "graphql-resolvers"
import { CustomError } from "../../utils/customError"
import { GeneralHelpers } from "../../helpers/GeneralHelpers"
import models from "src/apollo/server/models"
import { CATEGORY_ERROR } from "../../utils/errorMessages"
import { hasPermission } from "../Common/resolvers"
import ActivityHelpers from "../../helpers/ActivityHelpers"
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter"
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const resolvers = {
  Query: {
    getCompanyCategory: combineResolvers(hasPermission("Categories", 'view'), async (_, { input }, { user }) => {

      try {

        // FILTERING //
        let filter = JSON.parse(input?.filter || "{}")

        if (filter) {
          if (filter?.parentCategory?.length) {
            let filterParentCategory = filter?.parentCategory?.map(x => (new ObjectId(x)))
            filter = { ...filter, "parentCategory._id": { $in: filterParentCategory } }
            delete filter.parentCategory
          }
          if (filter?.category?.length) {
            let filterCategories = filter?.category?.map(x => (new ObjectId(x)) || [])
            filter = { ...filter, "category._id": { $in: filterCategories } }
            delete filter.category
          }
        }

        filter.company = user?.company;

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "companyCategoryTbl")
        filter = { ...filter, ...filterText }

        // SORTING //
        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            createdBy: "createdByUserName",
            categoryName: "category.categoryName",
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
            $addFields: {
              createdBy: { $first: "$createdByData" },
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] }
            }

          }
        ]

        const returnData = await models.Company_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    getCompanyCategoryInGroup: combineResolvers(hasPermission("Categories", 'view'), async (_, { input, catalogType }, { user }) => {

      try {

        // FILTERING //
        let filter = JSON.parse(input?.filter || "{}")

        // filter.company = user?.company;

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "companyCategoryTbl")
        filter = { ...filter, ...filterText }

        // SORTING //
        let sort = { createdAt: -1 }


        const populateQueries = [
          {
            $match: {
              isDeleted: false,
              company: user.company,
              catalogType: catalogType
            }
          },
          {
            $group: {
              _id: "$parentCategory.parentCategoryId",
              parentCategoryName: { $first: "$parentCategory.categoryName" },
              categories: {
                $push: {
                  categoryId: "$_id",
                  categoryName: "$category.categoryName",
                }
              }
            }
          },
          {
            $addFields: {
              isDeleted: false
            }
          }
        ]

        const returnData = await models.Company_categories.aggregate(populateQueries)

        // const returnData = await models.Company_categories.aggregate(populateQueries, filter, sort, input)


        return {
          count: returnData?.length || 0,
          data: returnData || [],
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),
  },
  Mutation: {
    addCompanyCategory: combineResolvers(hasPermission("Categories", 'create'), async (_, { input }, { user }) => {
      try {
        let allCategoryIds = input?.map(d => d?.category?._id)
        const alreadyExist = await models.Company_categories.find({ "category.categoryId": { $in: allCategoryIds }, isDeleted: false }).lean();
        if (!alreadyExist?.length) {

          let newCategory;
          input?.map(async (data) => {
            const allInput = {
              category: data.category,
              parentCategory: data.parentCategory,
              catalogType: data.catalogType,
              company: user.company,
              createdBy: user._id,
            }
            newCategory = models.Company_categories.create(allInput)

            return newCategory;
          })
        } else {
          throw new CustomError(CATEGORY_ERROR.ALREADY_EXIST, 400)
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),


    updateCompanyCategory: combineResolvers(hasPermission("Categories", 'edit'), async (_, { input }, { user }) => {
      try {

        const returnData = await models.Company_categories.findOneAndUpdate(
          {
            _id: input._id,
            isDeleted: false
          },
          { $set: { "category.categoryName": capitalizeFirstLetter(input.category) } },
          {
            new: true
          }
        );

        return returnData;

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    deleteCompanyCategory: combineResolvers(hasPermission("Categories", 'delete'), async (_, { input }, { user }) => {
      try {
        let getCategories = await models.Company_categories.find({ _id: { $in: input?.ids, $ne: user?._id } }).populate('category')
        let allIds = getCategories?.map(d => d?._id)
        let result = await models.Company_categories.updateMany({ _id: allIds }, { $set: { isDeleted: true } })

        let deletedCount = result.matchedCount;
        const deletedList = []

        getCategories?.map((category) => {
          deletedList.push({
            _id: category?._id,
            relatedToText: `${category?.category?.categoryName}`,
            message: ActivityHelpers.message({
              relatedToText: `${category?.category?.categoryName}`,
              messageType: ActivityHelpers.messageTypes.COMPANY_CATEGORIES_DELETE
            }),
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: ""
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  }
}