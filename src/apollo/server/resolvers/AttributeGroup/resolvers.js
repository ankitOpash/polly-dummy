import models from "src/apollo/server/models"
import { CustomError } from 'src/apollo/server/utils/customError'
import { GENERAL_ERROR } from 'src/apollo/server/utils/errorMessages'


import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"

export const resolvers = {
  Query: {
    getAttributeGroups: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        const returnData = await models.AttributeGroup.find().lean().exec()

        return returnData

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    createAttributeGroup: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        let allGroups = await models.AttributeGroup.find()

        let alreadyExistWithIds = input?.filter(x => x?._id)
        let productAttributeToBeUpdated = []

        for (let i = 0; i < alreadyExistWithIds.length; i++) {
          productAttributeToBeUpdated.push({
            updateOne: {
              filter: { "group": alreadyExistWithIds[i]._id },
              update: {
                $set: {
                  groupName: alreadyExistWithIds[i].name || ''
                }
              }
            }
          })
        }

        let productAttributes = await Promise.all(productAttributeToBeUpdated)

        await models.ProductAttribute.bulkWrite(productAttributes)
        await models.AdminProductAttribute.bulkWrite(productAttributes)

        let deleteToBeGroup = await models.AttributeGroup.find({ _id: { $nin: alreadyExistWithIds } }).select('name _id')

        let usedGroups = await models.AdminProductAttribute.find({ group: deleteToBeGroup?.map(x => x?._id), isDeleted: false }).lean().exec()
        let rejectedMsg = ''
        if (usedGroups && usedGroups.length) {
          let rejected = usedGroups.map(uGroup => uGroup.group?.toString())
          rejectedMsg = `${deleteToBeGroup.filter((x) => rejected.includes(x._id?.toString())).map((i) => i.name).join(', ')} - Attribute group in use`

          let rejectedExistGroup = deleteToBeGroup.filter((x) => rejected.includes(x._id?.toString()))
          rejectedExistGroup?.map(x => {
            let myObj = { _id: x._id?.toString(), name: x.name }
            let position = allGroups?.map(x => x.name).indexOf(myObj.name)
            input.splice(position, 0, myObj);
          })
        }

        await models.AttributeGroup.deleteMany()

        let recordsForCreate = input.map(x => {
          return {
            ...(x?._id ? { _id: x._id } : {}),
            name: x?.name,
            isDeleted: false,
            createdBy: user?._id,
            modifiedBy: user?._id
          }
        })

        await models.AttributeGroup.insertMany(recordsForCreate)

        return {
          successMsg: '',
          rejectedMsg: rejectedMsg
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

  }
}