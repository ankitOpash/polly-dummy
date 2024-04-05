import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PART_ERROR, PRICE_TEMPLATE_ERROR } from '../../utils/errorMessages'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllPriceTemplates: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
          delete filter.createdBy
        }

        filter = { ...filter, isDeleted: false }

        let sort = { createdAt: -1 }

        const priceTemplates = await models.PriceTemplate.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })
          .sort(sort)
          .skip(input?.page * input?.limit - input?.limit)
          .limit(input?.limit)

        const allAttributes = await models.AttributeCategory.find()

        const attributeFields = allAttributes.flatMap(category =>
          category?.attributeCategoryGroups?.flatMap(categoryGroup =>
            categoryGroup.attributes.flatMap(attribute => attribute)
          )
        )

        const populatedPriceTemplates = await Promise.all(
          priceTemplates.map(async priceTemplate => {
            const populatedFields = await Promise.all(
              priceTemplate.fields.map(async field => {
                const costTemplate = await models.CostTemplate.findById(field.costTemplateId)

                const dependentUponCategory = await models.Company_categories.findById(
                  costTemplate?.fields?.[0]?.dependentUponCategory
                )

                const convertedCostTemplate = JSON.parse(JSON.stringify(costTemplate))

                const attribute = attributeFields.find(
                  attribute => attribute?._id?.toString() === convertedCostTemplate?.fields?.[0]?.attribute?.toString()
                )

                return {
                  ...field.toObject(),
                  costTemplate: {
                    ...convertedCostTemplate,
                    fields: convertedCostTemplate?.fields?.map(field => ({
                      ...field,
                      dependentUponCategory,
                      attribute
                    }))
                  }
                }
              })
            )
            const createdBy = await models.Company.findById(priceTemplate.createdBy)

            return {
              ...priceTemplate.toObject(),
              fields: populatedFields,
              createdBy
            }
          })
        )

        const allPriceTemplates = await models.PriceTemplate.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })

        return {
          count: allPriceTemplates.length || 0,
          data: populatedPriceTemplates || []
        }
      } catch (e) {
        console.log(e)
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    },
    getPriceTemplateById: async (_, { id }, { user }) => {
      try {
        const priceTemplate = await models.PriceTemplate.findById(id).lean().exec()

        const allAttributes = await models.AttributeCategory.find()

        const attributeFields = allAttributes.flatMap(category =>
          category?.attributeCategoryGroups?.flatMap(categoryGroup =>
            categoryGroup.attributes.flatMap(attribute => attribute)
          )
        )

        const populatedFields = await Promise.all(
          priceTemplate.fields.map(async field => {
            const costTemplate = await models.CostTemplate.findById(field.costTemplateId)

            const dependentUponCategory = await models.Company_categories.findById(
              costTemplate?.fields?.[0]?.dependentUponCategory
            )

            const convertedCostTemplate = JSON.parse(JSON.stringify(costTemplate))

            const attribute = attributeFields.find(
              attribute => attribute?._id?.toString() === convertedCostTemplate?.fields?.[0]?.attribute?.toString()
            )

            return {
              ...field,
              costTemplate: {
                ...convertedCostTemplate,
                fields: convertedCostTemplate?.fields?.map(field => ({
                  ...field,
                  dependentUponCategory,
                  attribute
                }))
              }
            }
          })
        )

        const createdBy = await models.Company.findById(priceTemplate.createdBy)

        return { ...priceTemplate, fields: populatedFields, createdBy }
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    }
  },
  Mutation: {
    createPriceTemplate: async (_, { data }, { user }) => {
      try {
        const priceTemplate = await models.PriceTemplate.findOne({
          name: data.name,
          createdBy: user.company,
          isDeleted: false
        })
        if (priceTemplate) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 405)
        }

        const newPriceTemplate = new models.PriceTemplate({
          name: data.name,
          fields: data.fields,
          createdBy: user.company
        })
        await newPriceTemplate.save()

        return newPriceTemplate
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },
    deletePriceTemplate: async (_, { id }, { user }) => {
      try {
        const priceTemplates = await models.PriceTemplate.find({ _id: id, createdBy: user._id, isDeleted: false })
        if (!priceTemplates) {
          throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
        } else {
          let result = await models.PriceTemplate.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } }).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          priceTemplates?.map(template => {
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
    updatePriceTemplate: async (_, { id, data }, { user }) => {
      try {
        const isPriceTemplate = await models.PriceTemplate.findOne({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })

        if (!isPriceTemplate) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 400)
        }

        await models.PriceTemplate.updateOne(
          { _id: isPriceTemplate._id },
          {
            $set: {
              name: data.name,
              fields: data.fields,
              createdBy: user.company
            }
          }
        )

        const returnData = await models.PriceTemplate.findOne({ _id: isPriceTemplate._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}
