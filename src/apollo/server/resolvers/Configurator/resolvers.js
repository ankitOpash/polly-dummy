import ActivityHelpers from '../../helpers/ActivityHelpers'
import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, CONFIGURATOR_ERROR } from '../../utils/errorMessages'
import { hasPermission } from '../Common/resolvers'
import { combineResolvers } from 'graphql-resolvers'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { DBCollectionNames, ModulePrefix } from 'src/constants/default-const'

export const resolvers = {
  Query: {
    getAllConfigurators: combineResolvers(hasPermission('view', 'Configurators'), async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, 'configuratorTbl')
        filter = { ...filter, ...filterText, company: user.company }

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            createdBy: 'createdByUserName'
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
            $addFields: {
              createdBy: { $first: '$createdByData' },
              createdByUserName: {
                $concat: [{ $first: '$createdByData.firstName' }, ' ', { $first: '$createdByData.lastName' }]
              }
            }
          }
        ]

        const returnData = await models.Configurator.aggregate(
          GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input),
          { collation: { locale: 'en' } }
        )

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    getConfigurator: combineResolvers(hasPermission('view', 'Configurators'), async (_, { id }, { user }) => {
      try {
        const returnData = await models.Configurator.findOne({ _id: id, company: user?.company, isDeleted: false })
          .populate('products')
          .lean()
        if (!returnData) {
          throw new CustomError(CONFIGURATOR_ERROR.CONFIGURATOR_NOT_FOUND, 400)
        }

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },
  Mutation: {
    createConfigurator: combineResolvers(
      hasPermission('create', 'Configurators'),
      async (root, { input }, { user }) => {
        try {
          const configuratorName = capitalizeFirstLetter(input.name)

          const configurator = await models.Configurator.findOne({
            name: configuratorName,
            company: user.company,
            isDeleted: false
          })
          if (configurator) {
            throw new CustomError(CONFIGURATOR_ERROR.CONFIGURATOR_EXIST, 400)
          } else {
            let prefix = ModulePrefix.CONFIGURATOR

            let counter = await models.Counter.findOneAndUpdate(
              { module: DBCollectionNames.CONFIGURATOR, company: user?.company },
              { $inc: { seq_value: 1 } },
              {
                new: true,
                upsert: true
              }
            ).lean()

            let newConfigurator = await models.Configurator.create({
              ...input,
              name: configuratorName,
              uniqueCode: `${prefix}${counter.seq_value.toString()}`,
              company: user.company,
              createdBy: user._id,
              modifiedBy: user._id
            })

            return newConfigurator
          }
        } catch (e) {
          throw new CustomError(e.message || CONFIGURATOR_ERROR.UNKNOWN, e.code || 400)
        }
      }
    ),

    updateConfigurator: combineResolvers(
      hasPermission('edit', 'Configurators'),
      async (root, { id, input }, { user }) => {
        try {
          const configurator = await models.Configurator.findOne({ _id: id, company: user.company, isDeleted: false })
          if (!configurator) {
            throw new CustomError(CONFIGURATOR_ERROR.CONFIGURATOR_NOT_FOUND, 400)
          }

          const configuratorName = capitalizeFirstLetter(input.name)

          if (configurator.name !== configuratorName) {
            const configuratorWithSameName = await models.Configurator.findOne({
              _id: { $ne: configurator._id },
              name: configuratorName,
              company: user.company,
              isDeleted: false
            })
              .lean()
              .exec()
            if (configuratorWithSameName) {
              throw new CustomError(CONFIGURATOR_ERROR.CONFIGURATOR_EXIST, 400)
            }
          }

          const returnData = await models.Configurator.findOneAndUpdate(
            { _id: configurator._id },
            {
              $set: {
                ...input,
                name: configuratorName,
                modifiedBy: user._id
              }
            }
          )
            .lean()
            .exec()

          return returnData
        } catch (e) {
          throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
        }
      }
    ),

    deleteConfigurators: combineResolvers(hasPermission('delete', 'Configurators'), async (root, { ids }, { user }) => {
      try {
        const configurators = await models.Configurator.find({
          _id: { $in: ids },
          company: user.company,
          isDeleted: false
        })
        if (!configurators?.length) {
          throw new CustomError(CONFIGURATOR_ERROR.CONFIGURATOR_NOT_FOUND, 400)
        } else {
          let result = await models.Configurator.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } }).exec()
          let deletedCount = result.matchedCount
          const deletedList = []
          configurators?.map(configurator => {
            deletedList.push({
              _id: configurator?._id,
              relatedToText: `${configurator?.name}`,
              message: ActivityHelpers.message({
                relatedToText: `${configurator?.name}`,
                messageType: ActivityHelpers.messageTypes.CONFIGURATOR_DELETE
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
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  }
}
