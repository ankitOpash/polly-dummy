import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PART_ERROR, PRICE_TEMPLATE_ERROR } from '../../utils/errorMessages'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllCostTemplates: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')
        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
          delete filter.createdBy
        }
        filter = { ...filter, isDeleted: false }

        let sort = { createdAt: -1 }

        const costTemplates = await models.CostTemplate.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })
          .sort(sort)
          .skip(input?.page * input?.limit - input?.limit)
          .limit(input?.limit)

        const populatedCostTemplates = await Promise.all(
          costTemplates.map(async costTemplate => {
            const populatedFields = await Promise.all(
              costTemplate.fields.map(async field => {
                const attributeCategories = await models.AttributeCategory.find()

                const attribute = attributeCategories
                  .flatMap(category =>
                    category?.attributeCategoryGroups?.flatMap(categoryGroup =>
                      categoryGroup.attributes.flatMap(attribute => attribute)
                    )
                  )
                  ?.find(attribute => attribute?._id?.toString() === field?.attribute?.toString())
                const dependentUponCategory = await models.Company_categories.findById(field.dependentUponCategory)
                const unit = await models.Units.findById(field.unit)

                return {
                  ...field.toObject(),
                  unit,
                  attribute,
                  dependentUponCategory
                }
              })
            )

            return {
              ...costTemplate.toObject(),
              fields: populatedFields
            }
          })
        )

        const allCostTemplates = await models.CostTemplate.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })

        return {
          count: allCostTemplates.length || 0,
          data: populatedCostTemplates || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    },
    getCostTemplateById: async (_, { id }, { user }) => {
      try {
        const costTemplate = await models.CostTemplate.findById(id).lean()

        const populatedFields = await Promise.all(
          costTemplate.fields.map(async field => {
            const attributeCategories = await models.AttributeCategory.find()

            const attribute = attributeCategories
              .flatMap(category =>
                category?.attributeCategoryGroups?.flatMap(categoryGroup =>
                  categoryGroup.attributes.flatMap(attribute => attribute)
                )
              )
              ?.find(attribute => attribute?._id?.toString() === field?.attribute?.toString())
            const dependentUponCategory = await models.Company_categories.findById(field.dependentUponCategory)
            const unit = await models.Units.findById(field.unit)

            return {
              ...field,
              unit,
              attribute,
              dependentUponCategory
            }
          })
        )

        return { ...costTemplate, fields: populatedFields }
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    }
  },
  Mutation: {
    createCostTemplate: async (_, { data }, { user }) => {
      try {
        const costTemplate = await models.CostTemplate.findOne({
          name: data.name,
          createdBy: user.company,
          isDeleted: false
        })
        if (costTemplate) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 405)
        }

        const newCostTemplate = new models.CostTemplate({
          name: data.name,
          fields: data.fields,
          createdBy: user.company
        })
        await newCostTemplate.save()

        return newCostTemplate
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },
    deleteCostTemplate: async (_, { id }, { user }) => {
      try {
        const costTemplate = await models.CostTemplate.find({ _id: id, createdBy: user.company, isDeleted: false })
        if (!costTemplate) {
          throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
        } else {
          let result = await models.CostTemplate.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } }).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          costTemplate?.map(template => {
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
    updateCostTemplate: async (_, { id, data }, { user }) => {
      try {
        const isCostTemplate = await models.CostTemplate.findOne({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })

        if (!isCostTemplate) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 400)
        }

        await models.CostTemplate.updateOne(
          { _id: isCostTemplate._id },
          {
            $set: {
              name: data.name,
              fields: data.fields,
              createdBy: user.company
            }
          }
        )

        const returnData = await models.CostTemplate.findOne({ _id: isCostTemplate._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}
