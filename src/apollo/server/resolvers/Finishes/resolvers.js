import ActivityHelpers from '../../helpers/ActivityHelpers'
import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, MATERIAL_ERROR } from '../../utils/errorMessages'
import { hasPermission } from '../Common/resolvers'
import { combineResolvers } from 'graphql-resolvers'
import mongoose from 'mongoose'
import lodash from 'lodash'
import { extractFilePath } from 'src/utils/fileUtils'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { DBCollectionNames, ModulePrefix } from 'src/constants/default-const'
import { S3Helpers } from '../../helpers/S3Helpers'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllFinishes: combineResolvers(hasPermission('Finishes', 'view'), async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, 'FinishesTbl')
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

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            name: 'tempFinishesName',
            createdBy: 'createdByUserName'
          }

          if (renameSortKey[input?.sort?.key]) sortKey = renameSortKey[input?.sort?.key]
          sort = { [sortKey]: input?.sort?.type }
        }

        const populateQueries = [
          {
            $lookup: {
              from: 'units',
              localField: 'unitOfPrice',
              foreignField: '_id',
              as: 'unitOfPrice'
            }
          },
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
              tempFinishesName: { $toUpper: '$name' },
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
              unitOfPrice: { $first: '$unitOfPrice' }
            }
          }
        ]

        const filterName = { company: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        const returnData = await models.Finishes.aggregate(
          GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input)
        )

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    }),
    getFinishesDetailById: combineResolvers(hasPermission('Finishes', 'view'), async (_, { id }, { user }) => {
      try {
        let material = await models.Finishes?.findById(id)
          .populate('tags')
          .populate('grade')
          .populate({
            path: 'parentCategory'
          })
          .populate({
            path: 'category'
          })
          .populate({ path: 'unitOfPrice' })
          .lean()
        if (material.parentCategory) {
          material.parentCategory['_id'] = material?.parentCategory?._id
          material.parentCategory['categoryName'] = material?.parentCategory?.categoryName
        }
        if (material.category) {
          material.category['_id'] = material?.category?._id
          material.category['categoryName'] = material?.category?.category?.categoryName
          material.category['categoryId'] = material?.category?.category?.categoryId
        }

        return material
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    })
  },
  Mutation: {
    createFinishes: combineResolvers(hasPermission('Finishes', 'create'), async (_, { data }, { user }) => {
      try {
        const isFinishesExists = await models.Finishes.findOne({
          name: capitalizeFirstLetter(data.name),
          company: user.company,
          isDeleted: false
        })

        const isSkuExist = await models.Finishes.findOne({
          sku: data.sku.trim(),
          company: user.company,
          isDeleted: false
        })
        if (isFinishesExists) {
          throw new CustomError(MATERIAL_ERROR.MATERIAL_EXIST, 405)
        }
        if (isSkuExist) {
          throw new CustomError(MATERIAL_ERROR.SKU_EXIST, 405)
        } else {
          let prefix = ModulePrefix.MATERIAL

          let counter = await models.Counter.findOneAndUpdate(
            { module: DBCollectionNames.MATERIAL, company: user.company },
            { $inc: { seq_value: 1 } },
            {
              new: true,
              upsert: true
            }
          ).lean()

          let newFinishes = await models.Finishes.create({
            name: capitalizeFirstLetter(data.name),
            sku: data.sku,
            uniqueCode: `${prefix}${counter.seq_value.toString()}`,
            price: data.price,
            designerNetPrice: data.designerNetPrice,
            unit: data.unit,
            status: data?.status,
            images: data.images,
            description: data.description,
            thumb: data.thumb,
            status: data.status,
            visibilityStatus: data.visibilityStatus,
            parentCategory: data.parentCategory,
            category: data.category,
            tags: data.tags,
            attributes: data.attributes,
            grade: data.grade,
            company: user.company,
            unitOfPrice: data.unitOfPrice,
            createdBy: user?._id,
            modifiedBy: user?._id
          })

          return newFinishes
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    }),
    deleteFinishes: combineResolvers(hasPermission('Finishes', 'delete'), async (root, { id }, { user }) => {
      try {
        const material = await models.Finishes.find({ _id: { $in: id }, company: user.company, isDeleted: false })
        if (!material) {
          throw new CustomError(MATERIAL_ERROR.MATERIAL_NOT_FOUND, 405)
        } else {
          let result = await models.Finishes.updateMany(
            { _id: { $in: id }, company: new ObjectId(user.company) },
            { $set: { isDeleted: true } }
          ).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          material?.map(material => {
            deletedList.push({
              _id: material?._id,
              relatedToText: `${material?.name}`,
              message: ActivityHelpers.message({
                relatedToText: `${material?.name}`,
                messageType: ActivityHelpers.messageTypes.MATERIALS_DELETE
              })
            })
          })

          return {
            deletedCount,
            deletedList,
            rejectedList: [],
            rejectedMessage: ''
          }
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    }),
    updateFinishes: combineResolvers(hasPermission('Finishes', 'edit'), async (root, { id, data }, { user }) => {
      try {
        const isFinishesExists = await models.Finishes.findOne({ _id: id, company: user.company, isDeleted: false })
        if (!isFinishesExists) {
          throw new CustomError(MATERIAL_ERROR.MATERIAL_NOT_FOUND, 405)
        }
        if (isFinishesExists.name !== data.name) {
          const materialWithSameName = await models.Finishes.findOne({
            _id: { $ne: isFinishesExists._id },
            name: data.name,
            company: user.company,
            isDeleted: false
          })
            .lean()
            .exec()

          if (materialWithSameName) {
            throw new CustomError(MATERIAL_ERROR.MATERIAL_EXIST, 405)
          }
        }
        if (isFinishesExists.sku !== data.sku) {
          const skuwithSameName = await models.Finishes.findOne({
            _id: { $ne: isFinishesExists._id },
            sku: data.sku,
            company: user.company,
            isDeleted: false
          })
          if (skuwithSameName) {
            throw new CustomError(MATERIAL_ERROR.SKU_EXIST, 400)
          }
        }
        await models.Finishes.updateOne(
          { _id: isFinishesExists._id },
          {
            $set: {
              name: data.name.trim(),
              sku: data.sku,
              price: data.price,
              designerNetPrice: data.designerNetPrice,
              unit: data.unit,
              status: data?.status,
              images: data.images,
              description: data.description,
              thumb: data.thumb,
              status: data.status,
              visibilityStatus: data.visibilityStatus,
              parentCategory: data.parentCategory,
              category: data.category,
              tags: data.tags,
              unitOfPrice: data.unitOfPrice,
              attributes: data.attributes,
              grade: data.grade,
              modifiedBy: user?._id
            }
          }
        )

        const returnUpdatedData = await models.Finishes.findOne({ _id: isFinishesExists._id }).lean().exec()
        let imagesToBeDeleted = lodash.difference(isFinishesExists.images || [], returnUpdatedData.images || [])
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

        return returnUpdatedData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    }),

    updateFinishesettings: combineResolvers(
      hasPermission('Finishes', 'update'),
      async (root, { id, data }, { user }) => {
        try {
          const isFinishesExists = await models.Finishes.findOne({ _id: id, company: user.company, isDeleted: false })
          if (!isFinishesExists) {
            throw new CustomError(MATERIAL_ERROR.MATERIAL_NOT_FOUND, 405)
          }

          let updateObject = {
            'settings.shine': data?.shine,
            'settings.glass': data?.glass,
            'settings.glossiness': data?.glossiness,
            'settings.repeatX': data?.repeatX,
            'settings.repeatY': data?.repeatY,
            'settings.offsetX': data?.offsetX,
            'settings.offsetY': data?.offsetY,
            'settings.image': data?.image,
            'settings.roughnessHexColor': data?.roughnessHexColor,
            'settings.metalnessHexColor': data?.metalnessHexColor,
            'settings.imageWidth': data?.imageWidth,
            'settings.imageHeight': data?.imageHeight,
            'settings.cropperData': data?.cropperData,
            'settings.cropperData': {
              x: data?.cropperData?.x,
              y: data?.cropperData?.y,
              width: data?.cropperData?.width,
              height: data?.cropperData?.height,
              rotate: data?.cropperData?.rotate,
              scaleX: data?.cropperData?.scaleX,
              scaleY: data?.cropperData?.scaleY
            },
            'settings.width': data?.width,
            'settings.verticalSize': data?.verticalSize,
            'settings.horizontalSize': data?.horizontalSize,
            'settings.finishSize': data?.finishSize,
            'settings.roughnessFactor': data?.roughnessFactor,
            'settings.diffuse': data?.diffuse,
            'settings.metalness': data?.metalness,
            'settings.roughness': data?.roughness,
            'settings.normal': data?.normal,
            'settings.occlusion': data?.occlusion,
            'settings.opacity': data?.opacity,
            'settings.aspect': data?.aspect,
            'settings.emission': data?.emission,
            'settings.scale': data?.scale,

            modifiedBy: user?._id
          }
          await models.Finishes.updateOne(
            { _id: isFinishesExists._id },
            {
              $set: updateObject
            }
          )
          const returnData = await models.Finishes.findOne({ _id: isFinishesExists._id }).lean().exec()

          let imagesToBeDeleted = lodash.difference(isFinishesExists.images || [], returnData.images || [])
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
          throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
        }
      }
    )
  }
}
