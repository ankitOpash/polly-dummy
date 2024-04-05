import { v4 as uuidv4 } from 'uuid';
import models from "src/apollo/server/models"
import { CustomError } from 'src/apollo/server/utils/customError'
import { GENERAL_ERROR, USER_ERROR, COMPANY_ERROR } from 'src/apollo/server/utils/errorMessages'
import { GeneralHelpers } from "src/apollo/server/helpers/GeneralHelpers"
import { DBCollectionNames, GOD_COMPANY_TYPE } from 'src/constants/default-const'
import { CompanyStatus, CompanyReviewStatus } from 'src/constants/company-const'
import { UserStatus } from 'src/constants/user-const'
import {
  ModulePrefix,
  COMPANY_VIEWER_ROLE,
  COMPANY_EDITOR_ROLE,
  COMPANY_ADMIN_ROLE,
  defaultViewerPermissions,
  defaultEditorPermissions,
  defaultAdminPermissions,
  defaultThemeSettings,
} from 'src/constants/default-const'
import { EmailHelper } from "../../helpers/EmailHelpers"
import { EmailTemplates } from "../../utils/EmailTemplates"
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import ActivityHelpers from '../../helpers/ActivityHelpers';

export const resolvers = {
  Query: {
    hello: () => {
      console.log('testing')

      return "Hello, StoreFront!!!!!!"
    },
    getCompanies: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        let filter = JSON.parse(input?.filter || "{}")

        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "companiesTbl")
        filter = { ...filter, ...filterText }

        let sort = { createdAt: -1 }
        if (input?.sort?.key) {
          let sortKey = input?.sort?.key

          const renameSortKey = {
            name: "tempCompanyName",
            createdBy: "tempCreatedByUserName"
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
            $lookup: {
              from: "users",
              let: { companyId: "$_id" },

              // localField: "_id",
              // foreignField: "company",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$company", "$$companyId"] },
                        { $eq: ["$isCompany", true] }
                      ]
                    }
                  }
                }
              ],
              as: "userData",
            }
          },
          {
            $addFields: {
              createdBy: { $first: "$createdByData" },
              createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
              user: { $first: "$userData" },
              tempCompanyName: { $toUpper: "$name" },
              tempCreatedByUserName: { $toUpper: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] } }
            }
          },

        ]

        const returnData = await models.Company.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    getAllCompanies: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "companiesTbl")
        const returnData = await models.Company.find(filterText).sort({ createdAt: 1 })

        return returnData
      } catch (error) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    helloMutation: ({ input }) => {
    },
    createCompany: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        input.name = capitalizeFirstLetter(input?.name) || ''
        input.firstName = capitalizeFirstLetter(input?.firstName) || ''
        input.lastName = capitalizeFirstLetter(input?.lastName) || ''

        const isUserExist = await models.User.findOne({ email: input?.email?.trim(), isDeleted: false }).lean()
        const company = await models.Company.findOne({ name: new RegExp(["^", input?.name, "$"].join(""), 'i'), isDeleted: false }).lean()
        if (company) {
          throw new CustomError(USER_ERROR.COMPANY_EXIST, 400)
        }

        if (!isUserExist) {
          let counter = await models.Counter.findOneAndUpdate(
            { module: DBCollectionNames.COMPANY },
            { $inc: { seq_value: 1 } },
            {
              new: true,
              upsert: true
            }
          ).lean()

          let prefix = ModulePrefix.COMPANY;

          let companyDetails = await models.Company.create({
            name: input?.name?.trim(),
            email: input?.email?.trim(),
            uniqueCode: `${prefix}${counter.seq_value.toString()}`,
            status: CompanyStatus.INVITED,
            reviewStatus: CompanyReviewStatus.PENDING,
            type: input?.type,
            isDeleted: false,
            createdBy: user?._id,
            modifiedBy: user?._id
          })


          // create default role as Viewer for newly created company
          await models.Role.create({
            name: COMPANY_VIEWER_ROLE,
            company: companyDetails._id,
            permissions: defaultViewerPermissions,
            isDeleted: false
          });

          // create default role as Editor for newly created company
          await models.Role.create({
            name: COMPANY_EDITOR_ROLE,
            company: companyDetails._id,
            permissions: defaultEditorPermissions,
            isDeleted: false
          });

          // create default role as Admin for newly created company
          let roleAdminDetails = await models.Role.create({
            name: COMPANY_ADMIN_ROLE,
            company: companyDetails._id,
            permissions: defaultAdminPermissions,
            isDeleted: false
          });

          // create user
          let userDetails = await models.User.create({
            email: input?.email?.trim(),
            password: input?.password,
            company: companyDetails._id,
            role: roleAdminDetails._id,
            status: UserStatus.INVITED,
            verified: true,
            isCompany: true,
            firstName: input?.firstName,
            lastName: input?.lastName,
            phone: input?.phone,
            isDeleted: false,
            createdBy: user?._id,
            modifiedBy: user?._id
          });

          await models.CompanySetting.create({
            company: companyDetails._id,
            themeSettings: defaultThemeSettings,
            isDeleted: false,
            createdBy: user?._id,
            modifiedBy: user?._id
          })

          const token = uuidv4()
          await EmailHelper.emailNotification({
            //senderName: user?._id,
            body: EmailTemplates.inviteTeam({
              // companyName: user.company?.name,
              origin,
              link: `${origin}/reset-password?token=${token}&enrollment=true`,
              userData: {
                email: input.email.trim().toLowerCase(),
                password: input.password,
                invitedBy: "System Admin",
                userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
              }


              // company: user.company,
              // userData: user
            }),
            to: userDetails.email,
            subject: `Join ${user?.firstName ? `${user?.firstName} ${user?.lastName}` : null}'s ProCat360 Team`,

            // source: `${user.email}`,
          });

          // generate uuid for token
          await models.Session.create({ token, user: userDetails?._id, company: userDetails?.company, type: "enrollment" });

          return companyDetails;

        } else {
          throw new CustomError(USER_ERROR.USER_EXIST, 400)
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    updateCompany: combineResolvers(isAuthenticated, async (_, { input }, { user, origin }) => {
      try {

        input.name = capitalizeFirstLetter(input?.name) || ''
        input.firstName = capitalizeFirstLetter(input?.firstName) || ''
        input.lastName = capitalizeFirstLetter(input?.lastName) || ''
        const company = await models.Company.findOne({ _id: input.id, type: { $ne: GOD_COMPANY_TYPE }, isDeleted: false }).lean().exec()

        if (!company) {
          throw new CustomError(COMPANY_ERROR.NOT_FOUND, 400)
        }

        if (company?.type === GOD_COMPANY_TYPE) {
          throw new CustomError(COMPANY_ERROR.GOD_COMPANY_TYPE_UPDATE, 400)
        }

        if (company.name !== input.name.trim()) {
          const companyWithSameName = await models.Company.findOne({
            _id: { $ne: company._id },
            name: new RegExp(["^", input.name.trim(), "$"].join(""), 'i'),
            isDeleted: false
          }).lean().exec()
          if (companyWithSameName) {
            throw new CustomError(COMPANY_ERROR.COMPANY_EXIST, 400)
          }
        }

        const userData = await models.User.findOne({ company: company._id, isCompany: true, isDeleted: false })
        if (!userData) {
          throw new CustomError(USER_ERROR.NOT_FOUND, 400)
        }

        if (userData?.email?.trim() !== input?.email?.trim()) {
          const userWithSameEmail = await models.User.findOne({
            _id: { $ne: userData._id },
            email: input?.email?.trim(),
            isDeleted: false
          }).lean().exec()
          if (userWithSameEmail) {
            throw new CustomError(USER_ERROR.USER_EMAIL_EXIST, 400)
          }
        }

        await models.Company.updateOne(
          { _id: company._id, isDeleted: false },
          {
            $set: {
              name: input?.name?.trim(),
              type: input?.type,
              modifiedBy: user?._id
            }
          })

        const returnData = await models.Company.findOne({ _id: company._id, isDeleted: false }).lean().exec()

        let isMailSend = false;
        if (input.email && userData.email?.trim() !== input.email.trim()) {
          isMailSend = true;
        }
        userData.email = input?.email?.trim()
        userData.firstName = input?.firstName
        userData.lastName = input?.lastName
        userData.phone = input?.phone
        if (input?.password?.length) userData.password = input.password
        userData.modifiedBy = user._id
        await userData?.save()


        if (returnData?.status === 'invited') {
          if (isMailSend) {
            const token = uuidv4()
            await EmailHelper.emailNotification({
              //senderName: user?._id,
              body: EmailTemplates.inviteTeam({
                // companyName: user.company?.name,
                link: `${origin}/reset-password?token=${token}&enrollment=true`,
                userData: {
                  email: input.email.trim().toLowerCase(),
                  password: input.password,
                  invitedBy: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null,
                  userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
                }

                // company: user.company,
                // userData: user
              }),
              to: input.email,
              subject: `You're Invited`,

              // source: `${user.email}`,
            });

            // generate uuid for token
            await models.Session.create({ token, user: userData?._id, company: userData?.company, type: "enrollment" });
          }
        }

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    deleteCompanies: combineResolvers(isAuthenticated, async (_, { ids }, { user }) => {
      try {
        const companies = await models.Company.find({ _id: { $in: ids }, type: { $ne: GOD_COMPANY_TYPE }, isDeleted: false }).lean()
        if (!(companies && companies.length)) {
          throw new CustomError(COMPANY_ERROR.NOT_FOUND, 400)
        }

        let result = await models.Company.updateMany({ _id: { $in: companies }, isDeleted: false }, { isDeleted: true })
        await models.User.updateMany({ company: { $in: companies }, isDeleted: false }, { isDeleted: true })
        await models.CompanySetting.updateMany({ company: { $in: companies }, isDeleted: false }, { isDeleted: true })
        await models.Role.updateMany({ company: { $in: companies }, isDeleted: false }, { isDeleted: true })
        await models.Session.deleteMany({ company: { $in: companies } })

        let deletedCount = result.matchedCount;
        const deletedList = []
        companies?.map((c) => {
          deletedList.push({
            _id: c?._id,
            relatedToText: `${c?.name}`,
            message: ActivityHelpers.message({
              relatedToText: `${c?.name}`,
              messageType: ActivityHelpers.messageTypes.COMPANY_DELETE
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
    }),

    updateCompanyStatus: combineResolvers(isAuthenticated, async (root, { id, status }, { user }) => {
      try {

        // ** Verify id is interior-designer
        const company = await models.Company.findOne({ _id: id, type: { $ne: GOD_COMPANY_TYPE }, isDeleted: false }).lean().exec()
        if (!company) {
          throw new CustomError(COMPANY_ERROR.NOT_FOUND, 400)
        }

        let returnData = await models.Company.findOneAndUpdate({ _id: company._id, isDeleted: false }, { status, modifiedBy: user._id }).lean().exec()
        await models.User.updateMany({ company: company._id, isDeleted: false }, { status, modifiedBy: user._id, ...(status === UserStatus.ACTIVE && { verified: true }) }).lean().exec()
        if (returnData && status === UserStatus.INACTIVE) {
          await models.Session.deleteMany({ company: company._id })
        }

        return returnData

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    }),
  }
}
