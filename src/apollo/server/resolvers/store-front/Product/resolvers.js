import { GeneralHelpers } from "../../../helpers/GeneralHelpers"
import models from "../../../models"
import { CustomError } from "../../../utils/customError"
import { GENERAL_ERROR, PRODUCT_ERROR } from "../../../utils/errorMessages"
import mongoose from "mongoose"


const { ObjectId } = mongoose.Types;


export const resolvers = {
  Query: {
    getAllStoreFrontProduct: async (_, { input, company }, { user }) => {
      try {

        //filtering//
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "Product")
        if (input.search && input.search.length) {
          if (input.searchField) {
            const searchOnField = input.searchField === "status" ? input?.search?.replaceAll(' ', '_') : input.search
            if (input.searchField === 'category') {
              input.searchField = 'parentCategory.categoryName'
            }
            filter['$or'] = [
              { [input.searchField]: new RegExp(searchOnField, 'ig') }
            ]
          }
        }
        filter = { ...filter, ...filterText }

        //sorting//

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            name: "tempProductName",
            createdBy: "tempCreatedByUserName",
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
              from: 'admin_categories',
              localField: 'parentCategory',
              foreignField: '_id',
              as: 'parentCategoryData',
            },
          },
          {
            $lookup: {
              from: "company_categories",
              localField: "category",
              foreignField: "_id",
              as: "subCategoryData"
            }
          },
          {
            $addFields: {
              tempProductName: { $toUpper: "$name" },
              tempCreatedByUserName: { $toUpper: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] } },
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
              createdBy: { $first: "$createdByData" },
              category: {
                _id: '$category',
                categoryName: { $first: '$subCategoryData.category.categoryName' },
              },
              parentCategory: {
                _id: '$parentCategory',
                categoryName: { $first: '$parentCategoryData.categoryName' },
              }
            }
          }
        ]

        const filterName = { company: new ObjectId(company), isDeleted: false }
        filter = { ...filter, ...filterName }

        const returnData = await models.Product.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    },
    getStoreFrontProductDetailById: async (_, { id, company }, { user }) => {
      try {
        let product = await models.Product.findOne({ _id: id, isDeleted: false, company: company }).populate("tags").populate('settings.groups.materialCategory').populate({
          path: 'parentCategory',
        }).populate({
          path: 'category',
        }).lean()

        if (product?.parentCategory) {
          product.parentCategory['_id'] = product?.parentCategory?._id
          product.parentCategory['categoryName'] = product?.parentCategory?.categoryName
        }
        if (product?.category) {
          product.category['_id'] = product?.category?._id
          product.category['categoryName'] = product?.category?.category?.categoryName
          product.category['categoryId'] = product?.category?.category?.categoryId
        }

        return product
      } catch (e) {
        throw new CustomError(e.message || PRODUCT_ERROR.UNKNOWN, e.code || 400)
      }
    },
  }
}