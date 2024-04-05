import { combineResolvers } from "graphql-resolvers"
import { hasPermission } from "../Common/resolvers"
import models from "src/apollo/server/models"
import { CUSTOMER_ERROR, GENERAL_ERROR } from "../../utils/errorMessages"
import { CustomError } from "../../utils/customError"
import { GeneralHelpers } from "../../helpers/GeneralHelpers"
import { EmailHelper } from "../../helpers/EmailHelpers"
import { EmailTemplates } from "../../utils/EmailTemplates"
import ActivityHelpers from "../../helpers/ActivityHelpers"
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter"

export const resolvers = {
  Query: {
    getCustomer: combineResolvers(hasPermission('Customers', 'view'), async (_, { input }, { user }) => {
      try {

        // FILTERING //
        let filter = JSON.parse(input?.filter || "{}")
        filter.company = user?.company;

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "customerTbl")
        filter = { ...filter, ...filterText, _id: { $ne: user?._id } }

        // SORTING //
        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            createdBy: "createdByUserName",
          }

          if (renameSortKey[input?.sort?.key]) sortKey = renameSortKey[input?.sort?.key]
          sort = { [sortKey]: input?.sort?.type }
        }

        const populateQueries = [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdByData"
            }
          },
          {
            $addFields: {
              createdBy: { $first: "$createdByData" },
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
            }

          }
        ]
        const returnData = await models.Customer.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },
  Mutation: {
    addCustomer: combineResolvers(hasPermission('Customers', 'create'), async (_, { input }, { user }) => {
      try {

        const customerData = {
          firstName: capitalizeFirstLetter(input?.firstName),
          lastName: capitalizeFirstLetter(input?.lastName),
          email: input.email.trim().toLowerCase(),
          password: input.password,
          type: input.type,
          createdBy: user?._id,
          company: user.company,
          status: input.status,
          verified: input?.verified,
        }

        // EMAIL ALREADY EXIST //
        const isCustomerExist = await models.Customer.findOne({ email: input?.email?.trim(), isDeleted: false }).lean()
        if (!isCustomerExist) {
          const newCustomer = await models.Customer.create(customerData)

          await EmailHelper.emailNotification({
            body: EmailTemplates.inviteCustomer({
              // link: `${origin}/reset-password?token=${token}&enrollment=true`,
              userData: {
                userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
                invitedBy: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null,
                email: input.email.trim().toLowerCase(),
                password: input.password,
              }

              // company: user.company,
              // userData: user
            }),
            to: newCustomer.email,
            subject: `${user?.firstName ? `${user?.firstName} ${user?.lastName}` : null} invited you as customer`,

            // source: `${user.email}`,
          });

          return newCustomer;

        } else {
          throw new CustomError(CUSTOMER_ERROR.CUSTOMER_EXIST, 400)
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateCustomer: combineResolvers(hasPermission('Customers', 'edit'), async (root, { input }, { user, origin }) => {
      try {
        // const findCustomer = models.Customer.findById(input?.id)

        const returnData = await models.Customer.findOneAndUpdate({
          _id: input._id,
          isDeleted: false
        },
          {
            $set: {
              firstName: capitalizeFirstLetter(input?.firstName),
              lastName: capitalizeFirstLetter(input?.lastName),
              email: input.email,
              phone: input.phone,
              type: input.type,
              status: input.status,
              verified: input?.verified,
              modifiedBy: user?.id
            }
          },
          {
            new: true
          }
        )

        // WHEN WE NEED TO CHANGE EMAIL THEN SEND MAIL //
        // if (input.email !== findCustomer.email) {
        //   await EmailHelper.emailNotification({
        //     body: EmailTemplates.inviteCustomer({
        //       // link: `${origin}/reset-password?token=${token}&enrollment=true`,
        //       userData: {
        //         userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
        //         invitedBy: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null,
        //         email: input.email.trim().toLowerCase(),
        //         password: input.password,
        //       }

        //       // company: user.company,
        //       // userData: user
        //     }),
        //     to: findCustomer.email,
        //     subject: `${user?.firstName ? `${user?.firstName} ${user?.lastName}` : null} invited you as customer`,

        //     // source: `${user.email}`,
        //   });
        // }

        return returnData

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateCustomerStatus: combineResolvers(hasPermission('Customers', 'edit'), async (root, { status, id }, { user }) => {
      try {
        let customerData = await models.Customer.findOne({ _id: id, isDeleted: false }).lean()
        if (customerData) {
          let returnData = await models.Customer.findOneAndUpdate({ _id: customerData?._id }, { status }).lean().exec()

          return returnData ? true : false
        } else {
          false
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    resetCustomerPassword: async (root, { CustomerId, password, }) => {
      try {
        const customer = await models.Customer.findOne({ id: CustomerId, isDeleted: false })
        customer.password = password
        await customer?.save()
        if (customer) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }

    },

    deleteCustomer: combineResolvers(hasPermission('Customers', 'delete'), async (root, { input }, { user }) => {
      try {

        let getCustomers = await models.Customer.find({ _id: { $in: input?.ids, $ne: user?._id } }).lean()
        let allIds = getCustomers?.map(d => d?._id)
        let result = await models.Customer.updateMany({ _id: { $in: allIds } }, { $set: { isDeleted: true } })

        let deletedCount = result.matchedCount;
        const deletedList = []

        getCustomers?.map((customer) => {
          deletedList.push({
            _id: customer?._id,
            relatedToText: `${customer?.firstName} ${customer?.lastName}`,
            message: ActivityHelpers.message({
              relatedToText: `${customer?.firstName} ${customer?.lastName}`,
              messageType: ActivityHelpers.messageTypes.CUSTOMERS_DELETE
            }),
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: ""
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  }
}