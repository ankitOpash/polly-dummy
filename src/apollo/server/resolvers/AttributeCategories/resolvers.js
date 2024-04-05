import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PRICE_TEMPLATE_ERROR } from '../../utils/errorMessages'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllAttributeCategories: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
          delete filter.createdBy
        }

        filter = { ...filter, isDeleted: false }

        let sort = { createdAt: -1 }

        const populateQueries = [
          { $match: { name: { $regex: new RegExp(input?.search, 'i') }, createdBy: user.company } },
          {
            $lookup: {
              from: 'companies',
              localField: 'createdBy',
              foreignField: '_id',
              as: 'createdByData'
            }
          },
          {
            $addFields: {
              _id: '$_id',
              name: '$name',
              attributeCategoryGroups: '$attributeCategoryGroups',
              createdBy: { $first: '$createdByData' }
            }
          }
        ]

        const page = input?.page ?? 1
        const limit = input?.limit ?? 10

        const attributeCategories = await models.AttributeCategory.aggregate(populateQueries)
          .sort(sort)
          .skip(page * limit - limit)
          .limit(limit)

        const attributeCategoryPromises = attributeCategories.map(async attributeCategory => {
          const attributeCategoryGroupsPromises = attributeCategory.attributeCategoryGroups.map(
            async attributeCategoryGroup => {
              const attributesPromises = attributeCategoryGroup.attributes.map(async attribute => ({
                ...attribute,
                unit: await models.Units.findOne({ _id: attribute.unit }).lean().exec()
              }))

              attributeCategoryGroup.attributes = await Promise.all(attributesPromises)

              return attributeCategoryGroup
            }
          )

          attributeCategory.attributeCategoryGroups = await Promise.all(attributeCategoryGroupsPromises)

          return attributeCategory
        })

        // Resolve all attribute category promises
        const resolvedAttributeCategories = await Promise.all(attributeCategoryPromises)

        const totalAttributeCategories = await models.AttributeCategory.aggregate(populateQueries)
          .sort(sort)
          .skip(page * limit - limit)
          .limit(limit)

        return {
          count: totalAttributeCategories.length || 0,
          data: resolvedAttributeCategories || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    },

    getAttributeCategoryById: async (_, { id }, { user }) => {
      try {
        const returnData = await models.AttributeCategory.findOne({ _id: id, isDeleted: false })
          .populate('createdBy')
          .lean()
          .exec()

        const attributeCategoryGroupsPromises = returnData.attributeCategoryGroups.map(async attributeCategoryGroup => {
          const attributesPromises = attributeCategoryGroup.attributes.map(async attribute => ({
            ...attribute,
            unit: await models.Units.findOne({ _id: attribute.unit }).lean().exec()
          }))

          attributeCategoryGroup.attributes = await Promise.all(attributesPromises)

          return attributeCategoryGroup
        })

        returnData.attributeCategoryGroups = await Promise.all(attributeCategoryGroupsPromises)

        return returnData
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    }
  },
  Mutation: {
    createAttributeCategory: async (_, { data }, { user }) => {
      try {
        const attributeCategory = await models.AttributeCategory.findOne({
          name: data.name,
          createdBy: user.company,
          isDeleted: false
        })
        if (attributeCategory) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 405)
        }

        const newAttributeCategory = new models.AttributeCategory({
          name: data.name,
          attributeCategoryGroups: data.attributeCategoryGroups,
          createdBy: user.company
        })
        await newAttributeCategory.save()

        return newAttributeCategory
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },

    deleteAttributeCategory: async (_, { id }, { user }) => {
      try {
        const attributeCategories = await models.AttributeCategory.find({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })
        if (!attributeCategories) {
          throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
        } else {
          let result = await models.AttributeCategory.updateMany(
            { _id: { $in: id } },
            { $set: { isDeleted: true } }
          ).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          attributeCategories?.map(template => {
            deletedList.push({
              _id: template?._id,
              relatedToText: `${template?.name}`
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
    },
    updateAttributeCategory: async (_, { id, data }, { user }) => {
      try {
        const isAttributeCategory = await models.AttributeCategory.findOne({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })

        if (!isAttributeCategory) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 400)
        }

        await models.AttributeCategory.updateOne(
          { _id: isAttributeCategory._id },
          {
            $set: {
              name: data.name,
              attributeCategoryGroups: data.attributeCategoryGroups,
              createdBy: user.company
            }
          }
        )

        const returnData = await models.AttributeCategory.findOne({ _id: isAttributeCategory._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}
