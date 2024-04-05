import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PART_ERROR, PRICE_TEMPLATE_ERROR } from '../../utils/errorMessages'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllUnits: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
          delete filter.createdBy
        }

        filter = { ...filter, isDeleted: false }

        let sort = { createdAt: -1 }

        const units = await models.Units.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })
          .sort(sort)
          .skip(input?.page * input?.limit - input?.limit)
          .limit(input?.limit)

        const allUnits = await models.Units.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })

        return {
          count: allUnits.length || 0,
          data: units || []
        }
      } catch (e) {
        console.log(e)
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    },
    getUnitById: async (_, { id }, { user }) => {
      try {
        const unit = await models.Units.findById(id).lean().exec()
        const createdBy = await models.Company.findById(unit.createdBy)

        return { ...unit, createdBy }
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    }
  },
  Mutation: {
    createUnit: async (_, { data }, { user }) => {
      try {
        const unit = await models.Units.findOne({
          name: data.name,
          createdBy: user.company,
          isDeleted: false
        })
        if (unit) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 405)
        }

        const newUnit = new models.Units({
          name: data.name,
          createdBy: user.company
        })
        await newUnit.save()

        return newUnit
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },
    deleteUnit: async (_, { id }, { user }) => {
      try {
        const unit = await models.Units.find({ _id: id, createdBy: user._id, isDeleted: false })
        if (!unit) {
          throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
        } else {
          let result = await models.Units.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } }).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          unit?.map(template => {
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
    updateUnit: async (_, { id, data }, { user }) => {
      try {
        const isUnit = await models.Units.findOne({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })

        if (!isUnit) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 400)
        }

        await models.Units.updateOne(
          { _id: isUnit._id },
          {
            $set: {
              name: data.name,
              createdBy: user.company
            }
          }
        )

        const returnData = await models.PriceTemplate.findOne({ _id: isUnit._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}
