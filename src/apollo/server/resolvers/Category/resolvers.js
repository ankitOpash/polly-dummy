import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "../Common/resolvers";
import { CustomError } from "../../utils/customError";
import { CATEGORY_ERROR, GENERAL_ERROR } from "src/apollo/server/utils/errorMessages"
import { GeneralHelpers } from "../../helpers/GeneralHelpers";
import models from "src/apollo/server/models"
import ActivityHelpers from "../../helpers/ActivityHelpers";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const resolvers = {
  Query: {

    getCategory: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {

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
            filter = { ...filter, "_id": { $in: filterCategories } }
            delete filter.category
          }
        }

        // filter.company = user?.company;

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "categoryTbl")
        filter = { ...filter, ...filterText }

        // SORTING //
        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            createdBy: "createdByUserName",
            parentCategory: "parentCategory.categoryName",
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
              from: "admin_categories",
              localField: "parentCategory",
              foreignField: "_id",
              as: "parentCategoryData"
            }
          },
          {
            $addFields: {
              createdBy: { $first: "$createdByData" },
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
              parentCategory: { $first: "$parentCategoryData" },
            }

          }
        ]

        const returnData = await models.Admin_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

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

    addCategory: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        const allInput = {
          categoryName: capitalizeFirstLetter(input.categoryName),
          isSubCategory: input.parentCategory ? true : false,
          parentCategory: input.parentCategory,
          catalogType: input.catalogType,
          createdBy: user._id,
        }

        const alreadyExist = await models.Admin_categories.findOne({ categoryName: capitalizeFirstLetter(input.categoryName), parentCategory: input.parentCategory, isDeleted: false }).lean();
        const CategoryIsAlreadyExist = await models.Admin_categories.findOne({ categoryName: capitalizeFirstLetter(input.categoryName), isDeleted: false }).lean();
        if (!alreadyExist) {
          const newCategory = await models.Admin_categories.create(allInput)

          return { newCategory, CategoryIsAlreadyExist: CategoryIsAlreadyExist ? true : false };
        } else {
          throw new CustomError(CATEGORY_ERROR.ALREADY_EXIST, 400)
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateCategory: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        const returnData = await models.Admin_categories.findOneAndUpdate({
          _id: input._id,
          isDeleted: false
        },
          {
            $set: {
              categoryName: capitalizeFirstLetter(input.categoryName),
              parentCategory: input.parentCategory,
              catalogType: input.catalogType,
              modifiedBy: user?.id
            }
          },
          {
            new: true
          })

        return returnData

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    deleteCategory: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        let assignToCompanyCategory = await models.Company_categories.find({ "category.categoryId": { $in: input.ids }, isDeleted: false }).lean();
        let assignToCompanyParentCategory = await models.Company_categories.find({ "parentCategory.parentCategoryId": { $in: input.ids }, isDeleted: false }).lean();
        let assignToAttributeCategory = await models.AdminProductAttribute.find({ category: { $in: input.ids }, isDeleted: false }).lean();
        let assignToAttributeSubCategory = await models.AdminProductAttribute.find({ subCategory: { $in: input.ids }, isDeleted: false }).lean();

        if (!assignToCompanyCategory?.length && !assignToCompanyParentCategory?.length && !assignToAttributeCategory?.length && !assignToAttributeSubCategory?.length) {

          let getCategory = await models.Admin_categories.find({ _id: { $in: input?.ids, $ne: user?._id } }).lean()
          let allIds = getCategory?.map(d => d?._id)

          let result = await models.Admin_categories.updateMany({ $or: [{ _id: { $in: allIds } }, { parentCategory: { $in: allIds } }] }, { $set: { isDeleted: true } })
          let deletedCount = result.matchedCount;
          const deletedList = []

          getCategory?.map((category) => {
            deletedList.push({
              _id: category?._id,
              relatedToText: `${category?.categoryName}`,
              message: ActivityHelpers.message({
                relatedToText: `${category?.categoryName}`,
                messageType: ActivityHelpers.messageTypes.ADMIN_CATEGORIES_DELETE
              }),
            })
          })

          return {
            deletedCount,
            deletedList,
            rejectedList: [],
            rejectedMessage: ""
          }

        } else {
          throw new CustomError(CATEGORY_ERROR.CATEGORY_ASIGN, 400)
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  }
}