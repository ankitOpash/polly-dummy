import { combineResolvers } from 'graphql-resolvers'
import models from '../../models'
import ActivityHelpers from '../../helpers/ActivityHelpers'
import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, CONFIGURATOR_GROUP_ERROR } from '../../utils/errorMessages'
import { hasPermission, isAuthenticated } from '../Common/resolvers'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { DBCollectionNames, ModulePrefix } from 'src/constants/default-const'

export const resolvers = {
  Query: {
    getAllConfiguratorGroups: combineResolvers(
      hasPermission('view', 'ConfiguratorGroups'),
      async (_, { input, id }, { user }) => {
        try {
          let filter = JSON.parse(input?.filter || '{}')

          const filterText = GeneralHelpers.filterSearchQuery(input?.search, 'configuratorTbl')
          filter = { ...filter, ...filterText, company: user.company }

          const returnData = await models.ConfiguratorGroup.find({ configurator: id, isDeleted: false })
            .populate('configurator')
            .lean()

          return returnData
        } catch (e) {
          throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
        }
      }
    ),

    getConfiguratorGroup: combineResolvers(isAuthenticated, async (_, { id }, { user }) => {
      try {
        const populateOption = [
          { path: 'configurator' },
          { path: 'options.parts' },
          { path: 'options.materials' },
          { path: 'options.materialGroups', populate: 'materials' }
        ]

        const returnData = await models.ConfiguratorGroup.findOne({ _id: id }).populate(populateOption).lean()
        if (!returnData) {
          throw new CustomError(CONFIGURATOR_GROUP_ERROR.CONFIGURATOR_GROUP_NOT_FOUND, 400)
        }

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },
  Mutation: {
    createConfiguratorGroup: combineResolvers(
      hasPermission('create', 'ConfiguratorGroups'),
      async (root, { input }, { user }) => {
        try {
          const configuratorGroupName = capitalizeFirstLetter(input.name)

          const configuratorGroup = await models.ConfiguratorGroup.findOne({
            name: configuratorGroupName,
            company: user.company,
            isDeleted: false
          })
          if (configuratorGroup) {
            throw new CustomError(CONFIGURATOR_GROUP_ERROR.CONFIGURATOR_GROUP_EXIST, 400)
          } else {
            let prefix = ModulePrefix.CONFIGURATOR_GROUP

            let counter = await models.Counter.findOneAndUpdate(
              {
                module: DBCollectionNames.CONFIGURATOR_GROUP,
                company: user?.company,
                configurator: input.configurator
              },
              { $inc: { seq_value: 1 } },
              {
                new: true,
                upsert: true
              }
            ).lean()

            let newConfiguratorGroup = await models.ConfiguratorGroup.create({
              ...input,
              name: configuratorGroupName,
              uniqueCode: `${prefix}${counter.seq_value.toString()}`,
              configurator: input.configurator,
              isRequired: input?.isRequired || false,
              options: input?.options || [],
              company: user.company,
              createdBy: user._id,
              modifiedBy: user._id
            })

            return newConfiguratorGroup
          }
        } catch (e) {
          throw new CustomError(e.message || CONFIGURATOR_GROUP_ERROR.UNKNOWN, e.code || 400)
        }
      }
    ),

    updateConfiguratorGroup: combineResolvers(
      hasPermission('edit', 'ConfiguratorGroups'),
      async (root, { id, input }, { user }) => {
        try {
          const configuratorGroup = await models.ConfiguratorGroup.findOne({
            _id: id,
            company: user.company,
            isDeleted: false
          })
          if (!configuratorGroup) {
            throw new CustomError(CONFIGURATOR_GROUP_ERROR.CONFIGURATOR_GROUP_NOT_FOUND, 400)
          }

          const configuratorGroupName = capitalizeFirstLetter(input.name)

          if (configuratorGroup.name !== configuratorGroupName) {
            const configuratorWithSameName = await models.ConfiguratorGroup.findOne({
              _id: { $ne: configuratorGroup._id },
              name: configuratorGroupName,
              company: user.company,
              isDeleted: false
            })
              .lean()
              .exec()
            if (configuratorWithSameName) {
              throw new CustomError(CONFIGURATOR_GROUP_ERROR.CONFIGURATOR_GROUP_EXIST, 400)
            }
          }

          const returnData = await models.ConfiguratorGroup.findOneAndUpdate(
            { _id: configuratorGroup._id },
            {
              $set: {
                ...input,
                name: configuratorGroupName,
                isRequired: input?.isRequired || false,
                options: input?.options || [],
                company: user.company,
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

    deleteConfiguratorGroups: combineResolvers(
      hasPermission('delete', 'ConfiguratorGroups'),
      async (root, { ids }, { user }) => {
        try {
          const configurators = await models.ConfiguratorGroup.find({
            _id: { $in: ids },
            company: user.company,
            isDeleted: false
          })
          if (!configurators?.length) {
            throw new CustomError(CONFIGURATOR_GROUP_ERROR.CONFIGURATOR_GROUP_NOT_FOUND, 400)
          } else {
            let result = await models.ConfiguratorGroup.updateMany(
              { _id: { $in: ids } },
              { $set: { isDeleted: true } }
            ).exec()
            let deletedCount = result.matchedCount
            const deletedList = []
            configurators?.map(configuratorGroup => {
              deletedList.push({
                _id: configuratorGroup?._id,
                relatedToText: `${configuratorGroup?.name}`,
                message: ActivityHelpers.message({
                  relatedToText: `${configuratorGroup?.name}`,
                  messageType: ActivityHelpers.messageTypes.CONFIGURATOR_GROUP_DELETE
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
      }
    )
  }
}
