import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PART_ERROR, PRICE_TEMPLATE_ERROR } from '../../utils/errorMessages'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

export const resolvers = {
  Query: {
    getAllCollections: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')
        if (filter?.createdBy && filter?.createdBy.length > 0) {
          let filterCreatedBys = filter.createdBy.map(x => new ObjectId(x))
          filter = { ...filter, 'createdBy._id': { $in: filterCreatedBys } }
          delete filter.createdBy
        }
        filter = { ...filter, isDeleted: false }

        let sort = { createdAt: -1 }

        const collections = await models.Collections.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })
          .populate('products')
          .sort(sort)
          .skip(input?.page * input?.limit - input?.limit)
          .limit(input?.limit)

        const allCollections = await models.Collections.find({
          name: { $regex: new RegExp(input?.search, 'i') },
          createdBy: user.company,
          ...filter
        })

        return {
          count: allCollections.length || 0,
          data: collections || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    },
    getCollectionById: async (_, { id }, { user }) => {
      try {
        const collection = await models.Collections.findOne({ _id: id, isDeleted: false })
          .populate('products')
          .lean()
          .exec()

        return collection
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
      }
    }
  },
  Mutation: {
    createCollection: async (_, { data }, { user }) => {
      try {
        const collection = await models.Collections.findOne({
          name: data.name,
          createdBy: user.company,
          isDeleted: false
        })
        if (collection) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 405)
        }

        const newCollection = new models.Collections({
          name: data.name,
          description: data.description,
          products: data.products,
          createdBy: user.company
        })
        await newCollection.save()

        return newCollection
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },
    addProductsToCollection: async (_, { data }, { user }) => {
      try {
        const newProducts = data.products

        // push only unique products
        const updateCollection = await models.Collections.findOneAndUpdate(
          {
            _id: data.id,
            createdBy: user.company,
            isDeleted: false
          },
          {
            $addToSet: {
              products: { $each: newProducts }
            }
          },
          { new: true }
        )

        return updateCollection
      } catch (e) {
        throw new CustomError(e.message || PRICE_TEMPLATE_ERROR.UNKNOWN, e.code || 405)
      }
    },
    deleteCollection: async (_, { id }, { user }) => {
      try {
        const collections = await models.Collections.find({ _id: id, createdBy: user.company, isDeleted: false })
        if (!collections) {
          throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
        } else {
          let result = await models.Collections.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } }).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          collections?.map(template => {
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
    updateCollection: async (_, { id, data }, { user }) => {
      try {
        const isCollection = await models.Collections.findOne({
          _id: id,
          createdBy: user.company,
          isDeleted: false
        })

        if (!isCollection) {
          throw new CustomError(PRICE_TEMPLATE_ERROR.PART_EXIST, 400)
        }

        await models.Collections.updateOne(
          { _id: isCollection._id },
          {
            $set: {
              name: data.name,
              description: data.description,
              products: data.products,
              createdBy: user.company
            }
          }
        )

        const returnData = await models.Collections.findOne({ _id: isCollection._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}
