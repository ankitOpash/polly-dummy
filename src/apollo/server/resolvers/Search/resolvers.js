import mongoose from "mongoose"
import { GeneralHelpers } from "../../helpers/GeneralHelpers"
import models from "../../models"
import { CustomError } from "../../utils/customError"
import { combineResolvers } from "graphql-resolvers"
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"

export const resolvers = {
  Query: {
    searchTags: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchTagsTbl")
        filter = { ...filter, ...filterText }

        const filterName = { company: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        let sort = { updatedAt: -1 }

        const returnData = await models.Tag.aggregate(GeneralHelpers.aggregatePaginate([], filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    searchRoles: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchRolesTbl")
        filter = { ...filter, ...filterText }

        const filterName = { company: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        let sort = { updatedAt: -1 }

        const returnData = await models.Role.aggregate(GeneralHelpers.aggregatePaginate([], filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    searchGrade: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchGradesTbl")
        filter = { ...filter, ...filterText }

        const filterName = { company: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        let sort = { updatedAt: -1 }

        const returnData = await models.MaterialGrade.aggregate(GeneralHelpers.aggregatePaginate([], filter, sort, input))

        return returnData?.[0]?.data || []
      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    // GET ALL DATA OF ADMIN CATEGORIES FOR ADMIN-ADD-PARENT OPTION //
    searchAllAdminCategories: combineResolvers(isAuthenticated, async (_, { input, catalogType }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")
        filter.catalogType = catalogType


        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filter = { ...filter, ...filterText }

        let sort = { updatedAt: -1 }

        const populateQueries = [
          {
            $lookup: {
              from: "admin_categories",
              localField: "parentCategory",
              foreignField: "_id",
              as: "parentCategoryData"
            }
          },
          {
            $graphLookup: {
              from: "admin_categories",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "parentCategory",
              as: "subCategories"
            }
          },
          {
            $addFields: {
              parentCategory: { $first: "$parentCategoryData" },
              totalSubCategories: { $size: "$subCategories" },
            }
          }
        ]

        const returnData = await models.Admin_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // GET ALL DATA OF COMPANY CATEGORIES  //
    searchCompanyCategories: combineResolvers(isAuthenticated, async (_, { input, catalogType }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filterText.company = user.company
        filterText.catalogType = user.catalogType
        filter = { ...filter, ...filterText }


        let sort = { updatedAt: -1 }

        const populateQueries = [
          {
            $match: {
              isDeleted: false,
              company: user.company,
              catalogType: catalogType
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$category", { _id: "$_id" }, { isDeleted: "$isDeleted" }, { company: "$company" }],
              },
            },
          },
        ]

        const returnData = await models.Company_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // ONLY ADMIN PARENT CATEGORY DATA => USED IN MANAGE-CATEGORY-PARENT CATEGORY //
    searchAdminParentCategories: combineResolvers(isAuthenticated, async (_, { input, catalogType }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")
        filter.catalogType = catalogType

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filter = { ...filter, ...filterText }

        filter = { ...filter, totalSubCategories: { $gt: 0 } }
        let sort = { updatedAt: -1 }

        const populateQueries = [
          {
            $lookup: {
              from: "admin_categories",
              localField: "parentCategory",
              foreignField: "_id",
              as: "parentCategoryData"
            }
          },
          {
            $graphLookup: {
              from: "admin_categories",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "parentCategory",
              as: "subCategories"
            }
          },
          {
            $addFields: {
              parentCategory: { $first: "$parentCategoryData" },
              totalSubCategories: { $size: "$subCategories" },
            }
          }
        ]

        const returnData = await models.Admin_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // ONLY ADMIN SUB CATEGORY DATA => USED IN MANAGE-CATEGORY-SUB CATEGORY //
    searchAdminSubCategories: combineResolvers(isAuthenticated, async (_, { input, parentCategoryIds }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filter = { ...filter, ...filterText }

        const allObjectIds = parentCategoryIds?.map(d => new mongoose.Types.ObjectId(d));
        const filterName = { "parentCategoryData._id": { $in: allObjectIds } };
        filter = { ...filter, ...filterName }

        let sort = { updatedAt: -1 }

        const populateQueries = [
          {
            $lookup: {
              from: "admin_categories",
              localField: "parentCategory",
              foreignField: "_id",
              as: "parentCategoryData"
            }
          },
          {
            $graphLookup: {
              from: "admin_categories",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "parentCategory",
              as: "subCategories"
            }
          },
          {
            $addFields: {
              parentCategory: { $first: "$parentCategoryData" },
              totalSubCategories: { $size: "$subCategories" },
            }
          }
        ]

        const returnData = await models.Admin_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))


        return returnData?.[0]?.data || []
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // ONLY COMPANY PARENT CATEGORY DATA  //
    searchCompanyParentCategories: combineResolvers(isAuthenticated, async (_, { input, catalogType }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCompanyCategoriesTbl")
        filterText.company = user.company

        // filterText.catalogType = catalogType
        filter = { ...filter, ...filterText }

        let sort = { updatedAt: -1 }

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
              _id: "$parentCategory.parentCategoryId", // Group by parentCategoryId
              parentCategory: { $first: "$parentCategory" }, // Preserve the parentCategory object
              company: { $first: "$company" },
            },
          },
          {
            $addFields: {
              parentCategory: {
                $mergeObjects: ["$parentCategory", { isDeleted: false }, { company: "$company" }],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$parentCategory", // Replace the root with the parentCategory object
            },
          }

        ]

        const returnData = await models.Company_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // ONLY COMPANY SUB CATEGORY DATA => USED IN MANAGE-CATEGORY-SUB CATEGORY //
    searchCompanySubCategories: combineResolvers(isAuthenticated, async (_, { input, parentCategoryId, catalogType }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filterText.company = user.company
        filterText.catalogType = user.catalogType
        filter = { ...filter, ...filterText }


        let sort = { updatedAt: -1 }

        parentCategoryId = new mongoose.Types.ObjectId(parentCategoryId)

        const populateQueries = [
          {
            $match: {
              "parentCategory.parentCategoryId": parentCategoryId,
              isDeleted: false,
              company: user.company,
              catalogType: catalogType
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$category", { _id: "$_id" }, { isDeleted: "$isDeleted" }, { company: "$company" }],
              },
            },
          },
        ]

        const returnData = await models.Company_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    // ONLY COMPANY SUB CATEGORY DATA => USED IN MANAGE-CATEGORY-SUB CATEGORY-FILTER_FROM-MULTIPLE-PARENT-CATEGORY //
    searchCompanySubCategoriesForFilter: combineResolvers(isAuthenticated, async (_, { input, parentCategoryIds, catalogType }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCategoriesTbl")
        filterText.company = user.company
        filterText.catalogType = user.catalogType
        filter = { ...filter, ...filterText }

        let sort = { updatedAt: -1 }

        const populateQueries = [
          {
            $match: {
              "parentCategory._id": { $in: (parentCategoryIds || []).map(d => new mongoose.Types.ObjectId(d)) },
              isDeleted: false,
              company: user.company,
              catalogType: catalogType
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ _id: "$_id" }, { isDeleted: "$isDeleted" }, { company: "$company" }, { parentCategory: "$parentCategory" }, "$category"],
              },
            },
          },
        ]

        const returnData = await models.Company_categories.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    searchAdminAttributes: combineResolvers(isAuthenticated, async (_, { input, catalogType }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")
        filter.catalogType = catalogType

        let adminAttributeIds = await models.ProductAttribute.distinct(
          'adminAttributeRef',
          {
            company: user.company,
            catalogType: catalogType,
            isDeleted: false
          }
        )

        if (adminAttributeIds && adminAttributeIds.length) {
          filter = { ...filter, _id: { $nin: adminAttributeIds } }
        }

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "adminProductAttributeTbl")
        filter = { ...filter, ...filterText }

        let sort = { updatedAt: -1 }

        const populateQueries = [
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
              group: { $first: "$groupData" },
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


        const returnData = await models.AdminProductAttribute.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return returnData?.[0]?.data || []
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    searchProducts: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        if (filter.configurator) {
          const configData = await models.Configurator.findOne({ _id: filter.configurator }, { products: 1 }).lean()
          filter = { ...filter, _id: { $nin: configData.products } }
          delete filter.configurator
        } else {
          delete filter.configurator
        }
        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCatelogTbl")
        filter = { ...filter, ...filterText, company: user.company }
        let sort = { name: 1 }

        const returnData = await models.Product.aggregate(GeneralHelpers.aggregatePaginate([], filter, sort, input), { collation: { locale: "en" } })

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    searchMaterials: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCatelogTbl")
        filter = { ...filter, ...filterText, company: user.company }
        let sort = { name: 1 }

        const pipeline = [
          {
            $lookup: {
              from: "grades",
              localField: "grade",
              foreignField: "_id",
              as: "gradeData"
            }
          },
          {
            $addFields: {
              grade: { $first: "$gradeData.grade" },
            }
          }
        ]

        const returnData = await models.Material.aggregate(GeneralHelpers.aggregatePaginate(pipeline, filter, sort, input), { collation: { locale: "en" } })

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    searchParts: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "searchCatelogTbl")
        filter = { ...filter, ...filterText, company: user.company }
        let sort = { name: 1 }

        const returnData = await models.Part.aggregate(GeneralHelpers.aggregatePaginate([], filter, sort, input), { collation: { locale: "en" } })

        return returnData?.[0]?.data || []

      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }
    }),

    searchCreatedBy: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "userTbl")
        filter = { ...filter, ...filterText, company: user.company, isDeleted: false, isCompany: false }

        const returnData = await models.User.find(filter)

        return returnData
      } catch (e) {
        throw new CustomError(e.message || INVALID_REQUEST, e.code || 400)
      }

    })

  }
}