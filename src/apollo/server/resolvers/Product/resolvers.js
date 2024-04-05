import { combineResolvers } from 'graphql-resolvers'
import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import models from '../../models'
import { hasPermission, isAuthenticated } from '../Common/resolvers'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PRODUCT_ERROR } from '../../utils/errorMessages'
import { DBCollectionNames, ModulePrefix } from 'src/constants/default-const'
import ActivityHelpers from '../../helpers/ActivityHelpers'
import mongoose from 'mongoose'
import lodash from 'lodash'
import { extractFilePath } from 'src/utils/fileUtils'
import { S3Helpers } from '../../helpers/S3Helpers'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

const { ObjectId } = mongoose.Types

export const resolvers = {
  MaterialsOrPart: {
    __resolveType(obj, contextValue, info) {
      return obj.type
    }
  },
  Query: {
    getAllProduct: combineResolvers(hasPermission('view', 'Product'), async (_, { input }, { user }) => {
      try {
        //filtering//
        let filter = JSON.parse(input?.filter || '{}')

        if (filter?.category && filter?.category.length > 0 && !filter?.category.includes('all')) {
          let filterCategories = filter.category.map(x => new ObjectId(x))
          filter = { ...filter, 'category._id': { $in: filterCategories } }
        }
        delete filter.category

        if (filter.price && Object.keys(filter.price)?.length > 0) {
          filter.price = {
            $gte: Number(filter.price.min),
            $lte: Number(filter.price.max)
          }
        } else {
          delete filter.price
        }

        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
        }
        delete filter.createdBy

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, 'Product')
        if (input.search && input.search.length) {
          if (input.searchField) {
            const searchOnField = input.searchField === 'status' ? input?.search?.replaceAll(' ', '_') : input.search
            if (input.searchField === 'category') {
              input.searchField = 'parentCategory.categoryName'
            }
            filter['$or'] = [{ [input.searchField]: new RegExp(searchOnField, 'ig') }]
          }
        }

        filter = { ...filter, ...filterText }

        //sorting//

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            name: 'tempProductName',
            createdBy: 'tempCreatedByUserName'
          }

          if (renameSortKey[input?.sort?.key]) sortKey = renameSortKey[input?.sort?.key]
          sort = { [sortKey]: input?.sort?.type }
        }

        const populateQueries = [
          {
            $lookup: {
              from: 'users',
              localField: 'createdBy',
              foreignField: '_id',
              as: 'createdByData'
            }
          },
          {
            $lookup: {
              from: 'admin_categories',
              localField: 'parentCategory',
              foreignField: '_id',
              as: 'parentCategoryData'
            }
          },
          {
            $lookup: {
              from: 'company_categories',
              localField: 'category',
              foreignField: '_id',
              as: 'subCategoryData'
            }
          },
          {
            $addFields: {
              tempProductName: { $toUpper: '$name' },
              tempCreatedByUserName: {
                $toUpper: {
                  $concat: [{ $first: '$createdByData.firstName' }, ' ', { $first: '$createdByData.lastName' }]
                }
              },
              createdByUserName: {
                $concat: [{ $first: '$createdByData.firstName' }, ' ', { $first: '$createdByData.lastName' }]
              },
              createdBy: { $first: '$createdByData' },
              category: {
                _id: '$category',
                categoryName: { $first: '$subCategoryData.category.categoryName' }
              },
              parentCategory: {
                _id: '$parentCategory',
                categoryName: { $first: '$parentCategoryData.categoryName' }
              },
              priceTemplates: '$priceTemplates'
            }
          }
        ]

        const filterName = { company: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        const returnData = await models.Product.aggregate(
          GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input)
        )

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),
    getProductDetailById: combineResolvers(hasPermission('view', 'Product'), async (_, { id }, { user }) => {
      try {
        let product = await models.Product.findById(id)
          .populate('tags')
          .populate('settings.groups.materialCategory')
          .populate({
            path: 'parentCategory'
          })
          .populate({
            path: 'category'
          })
          .populate({
            path: 'thirdCategory'
          })
          .populate({ path: 'priceTemplates' })
          .lean()

        if (product.parentCategory) {
          product.parentCategory['_id'] = product?.parentCategory?._id
          product.parentCategory['categoryName'] = product?.parentCategory?.categoryName
        }
        if (product.category) {
          product.category['_id'] = product?.category?._id
          product.category['categoryName'] = product?.category?.category?.categoryName
          product.category['categoryId'] = product?.category?.category?.categoryId
        }
        if (product.thirdCategory) {
          product.thirdCategory['_id'] = product?.thirdCategory?._id
          product.thirdCategory['categoryName'] = product?.thirdCategory?.category?.categoryName
          product.thirdCategory['categoryId'] = product?.thirdCategory?.category?.categoryId
        }

        const allAttributes = await models.AttributeCategory.find()

        const attributeFields = allAttributes.flatMap(category =>
          category?.attributeCategoryGroups?.flatMap(categoryGroup =>
            categoryGroup.attributes.flatMap(attribute => attribute)
          )
        )

        const priceTemplates = await Promise.all(
          product?.priceTemplates?.map(async template => {
            const fields = await Promise.all(
              template.fields.map(async field => {
                const costTemplate = await models.CostTemplate.findById(field.costTemplateId)

                const attribute = attributeFields.find(
                  attribute => attribute?._id?.toString() === field?.attribute?.toString()
                )

                const dependentUponCategory = await models.Company_categories.findById(
                  costTemplate?.fields?.[0]?.dependentUponCategory
                )

                let materialOrPart = null
                if (field.dependentUpon === 'Material') {
                  materialOrPart = await models.Material.findById(field.materialOrPart)
                    .populate('unitOfPrice')
                    .lean()
                    .exec()
                  materialOrPart = { ...materialOrPart, type: 'Material' }
                } else if (field.dependentUpon === 'Part') {
                  materialOrPart = await models.Part.findById(field.materialOrPart).lean().exec()
                  materialOrPart = { ...materialOrPart, type: 'Part' }
                }

                return {
                  ...field,
                  costTemplate,
                  attribute,
                  dependentUponCategory,
                  materialOrPart
                }
              })
            )

            return {
              ...template,
              fields
            }
          }) ?? []
        )

        const attributeGroups = await Promise.all(
          product?.attributeGroups?.map(async group => ({
            ...group,
            attributes: await Promise.all(
              group.attributes.map(async attribute => {
                const unit = await models.Units.findById(attribute.unit).lean().exec()

                return { ...attribute, unit }
              })
            )
          }))
        )

        const configurator = await models.Configurator.findOne({
          products: { $in: [id] },
          isDeleted: false,
          isSingleProductConfigurator: true
        })

        return { ...product, priceTemplates, attributeGroups, singleProductConfigurator: configurator }
      } catch (e) {
        throw new CustomError(e.message || PRODUCT_ERROR.UNKNOWN, e.code || 400)
      }
    }),

    getProductAttribute: combineResolvers(
      isAuthenticated,
      async (_, { parentCategory, category, catalogType }, { user }) => {
        try {
          let attributes = []
          parentCategory = new ObjectId(parentCategory)
          category = new ObjectId(category)

          attributes = await models.ProductAttribute.aggregate([
            {
              $match: {
                $and: [
                  {
                    $or: [
                      {
                        parentCategory: {
                          $in: [parentCategory]
                        }
                      },
                      {
                        parentCategory: []
                      }
                    ]
                  },
                  {
                    $or: [
                      {
                        category: {
                          $in: [category]
                        }
                      },
                      {
                        category: []
                      }
                    ]
                  },
                  {
                    catalogType: catalogType
                  },
                  {
                    isDeleted: false
                  },
                  {
                    company: user.company
                  }
                ]
              }
            },
            {
              $group: {
                _id: '$group',
                total: { $sum: 1 },
                attributes: { $push: '$$ROOT' },
                groupName: { $first: '$groupName' }
              }
            }
          ])

          return attributes
        } catch (e) {
          console.log('==e', e)
        }
      }
    )
  },
  Mutation: {
    createProduct: combineResolvers(hasPermission('create', 'Product'), async (_, { data }, { user }) => {
      try {
        data.name = capitalizeFirstLetter(data?.name) || ''

        // const isProductExist = await models.Product.findOne({ name: data.name.trim(), company: user.company, isDeleted: false })
        const isSkuExist = await models.Product.findOne({
          sku: data.sku.trim(),
          company: user.company,
          isDeleted: false
        })

        // if (isProductExist) {
        //     throw new CustomError(PRODUCT_ERROR.PRODUCT_EXIST, 400)
        // }
        if (isSkuExist) {
          throw new CustomError(PRODUCT_ERROR.SKU_EXIST, 400)
        } else {
          let prefix = ModulePrefix.PRODUCT

          let counter = await models.Counter.findOneAndUpdate(
            { module: DBCollectionNames.PRODUCT, company: user.company },
            { $inc: { seq_value: 1 } },
            {
              new: true,
              upsert: true
            }
          ).lean()

          const priceTemplatesWithCompany = data.priceTemplates.map(template => ({
            ...template,
            createdBy: user.company
          }))

          let newProduct = await models.Product.create({
            name: data.name?.trim(),
            sku: data.sku,
            uniqueCode: `${prefix}${counter.seq_value?.toString()}`,
            price: data.price,
            designerNetPrice: data.designerNetPrice,
            status: data?.status,
            images: data.images,
            description: data.description,
            thumb: data.thumb,
            status: data.status,
            visibilityStatus: data.visibilityStatus,
            parentCategory: data.parentCategory,
            category: data.category,
            thirdCategory: data.thirdCategory,
            tags: data.tags,
            attributes: data.attributes,
            company: user.company,
            createdBy: user?._id,
            modifiedBy: user?._id,
            priceTemplates: priceTemplatesWithCompany,
            attributeGroups: data.attributeGroups
          })

          return newProduct
        }
      } catch (e) {
        throw new CustomError(e.message || PRODUCT_ERROR.UNKNOWN, e.code || 400)
      }
    }),
    deleteProduct: combineResolvers(hasPermission('delete', 'Product'), async (_, { id }, { user }) => {
      try {
        let getProducts = await models.Product.find({ _id: { $in: id, $ne: user?._id } }).lean()

        let result = await models.Product.updateMany(
          { _id: { $in: id }, company: new ObjectId(user.company) },
          { $set: { isDeleted: true } }
        ).exec()
        let deletedCount = result.matchedCount
        const deletedList = []
        getProducts?.map(prd => {
          deletedList.push({
            _id: prd?._id,
            relatedToText: `${prd?.name}`,
            message: ActivityHelpers.message({
              relatedToText: `${prd?.name}`,
              messageType: ActivityHelpers.messageTypes.PRODUCTS_DELETE
            })
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: ''
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),
    updateProduct: combineResolvers(hasPermission('update', 'Product'), async (_, { id, data }, { user }) => {
      try {
        data.name = capitalizeFirstLetter(data?.name) || ''
        const isProductExist = await models.Product.findOne({ _id: id, company: user.company, isDeleted: false })
        if (!isProductExist) {
          throw new CustomError(PRODUCT_ERROR.PRODUCT_NOT_FOUND, 400)
        }

        // if (isProductExist.name !== data.name) {
        //     const productwithSameName = await models.Product.findOne({
        //         _id: { $ne: isProductExist._id },
        //         name: data.name,
        //         company: user.company,
        //         isDeleted: false
        //     }).lean().exec()

        //     if (productwithSameName) {
        //         throw new CustomError(PRODUCT_ERROR.PRODUCT_EXIST, 400)
        //     }
        // }
        if (isProductExist.sku !== data.sku) {
          const skuwithSameName = await models.Product.findOne({
            _id: { $ne: isProductExist._id },
            sku: data.sku
          })
          if (skuwithSameName) {
            throw new CustomError(PRODUCT_ERROR.SKU_EXIST, 400)
          }
        }

        const priceTemplatesWithCompany = data.priceTemplates.map(template => ({
          ...template,
          createdBy: user.company
        }))

        await models.Product.updateOne(
          { _id: isProductExist._id },
          {
            $set: {
              name: data.name.trim(),
              sku: data.sku,
              price: data.price,
              designerNetPrice: data.designerNetPrice,
              images: data.images,
              description: data.description,
              thumb: data.thumb,
              status: data.status,
              visibilityStatus: data.visibilityStatus,
              parentCategory: data.parentCategory,
              category: data.category,
              thirdCategory: data.thirdCategory,
              tags: data.tags,
              attributes: data.attributes,
              modifiedBy: user?._id,
              priceTemplates: priceTemplatesWithCompany,
              attributeGroups: data.attributeGroups
            }
          }
        )
        const returnData = await models.Product.findOne({ _id: isProductExist._id }).lean().exec()
        let imagesToBeDeleted = lodash.difference(isProductExist.images || [], returnData.images || [])
        if (imagesToBeDeleted && imagesToBeDeleted.length) {
          let fileObjects = []
          imagesToBeDeleted.forEach(img => {
            const { filepath, filename } = extractFilePath(img)
            fileObjects.push({ Key: `public/${img}` })
            fileObjects.push({ Key: `public/${filepath}${filename}.webp` })
          })
          const s3 = S3Helpers.getS3Object()
          await S3Helpers.removeFilesFromS3(s3, {
            Bucket: process.env.APP_BUCKET,
            Delete: {
              Objects: fileObjects
            }
          })
        }

        return returnData
      } catch (e) {
        console.log(e, 'error')
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateProductSettings: combineResolvers(hasPermission('update', 'Product'), async (_, { id, data }, { user }) => {
      try {
        const isProductExist = await models.Product.findOne({ _id: id, company: user.company, isDeleted: false })
        if (!isProductExist) {
          throw new CustomError(PRODUCT_ERROR.PRODUCT_NOT_FOUND, 400)
        }

        const updateObject = {
          ...(data?.groups && { 'settings.groups': data.groups }),
          ...(data?.image && { 'settings.image': data.image }),
          ...(data?.objUrl && { 'settings.objUrl': data.objUrl }),
          ...(data?.gltfUrl && { 'settings.gltfUrl': data.gltfUrl }),
          ...(data?.fbxUrl && { 'settings.fbxUrl': data.fbxUrl }),
          modifiedBy: user?._id
        }

        // Update the product settings
        await models.Product.updateOne({ _id: isProductExist._id }, { $set: updateObject })

        // Generate GLTF
        const response = await fetch(`${process.env.ENDPOINT_URL}/api/singleProductsGenerateGLTF`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId: id })
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const responseData = await response.json()

        // Handle image deletion
        const imagesToBeDeleted = lodash.difference(isProductExist.images || [], responseData.images || [])

        if (imagesToBeDeleted && imagesToBeDeleted.length) {
          const fileObjects = imagesToBeDeleted.flatMap(img => [
            { Key: `public/${img}` },
            { Key: `public/${extractFilePath(img).filepath}${extractFilePath(img).filename}.webp` }
          ])

          const s3 = S3Helpers.getS3Object()
          await S3Helpers.removeFilesFromS3(s3, {
            Bucket: process.env.APP_BUCKET,
            Delete: { Objects: fileObjects }
          })
        }

        // Fetch the final product data
        const returnData = await models.Product.findOne({ _id: isProductExist._id })
          .populate('settings.groups.materialCategory')
          .lean()
          .exec()

        return returnData
      } catch (error) {
        console.error('Error:', error)
        throw new CustomError(error.message || GENERAL_ERROR.UNKNOWN, error.code || 500)
      }
    })
  }

  // Materials: {
  //   isTypeOf: obj => obj instanceof Materials
  // },
  // Part: {
  //   isTypeOf: obj => obj instanceof Part
  // }
}
