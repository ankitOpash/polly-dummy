import { v4 as uuidv4 } from 'uuid';
import models from "src/apollo/server/models"
import { CustomError } from 'src/apollo/server/utils/customError'
import { COMPANY_ERROR, GENERAL_ERROR, USER_ERROR } from 'src/apollo/server/utils/errorMessages'
import { CompanyStatus, CompanyReviewStatus } from 'src/constants/company-const'
import { UserStatus } from 'src/constants/user-const'
import { DBCollectionNames } from 'src/constants/default-const'
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
import { GeneralHelpers } from "src/apollo/server/helpers/GeneralHelpers"
import { issueNewToken } from "../../utils/middleware"
import { EmailHelper } from "../../helpers/EmailHelpers"
import { EmailTemplates } from '../../utils/EmailTemplates';
import axios from 'axios';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"

export const resolvers = {
  Query: {

    getUserSessions: combineResolvers(isAuthenticated, async (root, args, { user }) => {
      try {
        const userData = await models.Session.find({ ...(user?.role?.godUsers && { user: user._id }), type: "access_token", isGodUser: user?.role?.godUsers }).sort({ createdAt: -1 }).lean()

        return userData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    getUser: combineResolvers(isAuthenticated, async (root, args, { user }) => {
      try {
        const userData = await models.User.findOne({ _id: user._id, isDeleted: false })

        return userData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    signUp: async (root, { input }, { origin, sourceIP }) => {
      try {

        const isUserExist = await models.User.findOne({ email: input?.email?.trim(), isDeleted: false }).lean()
        const company = await models.Company.findOne({ name: new RegExp(["^", input?.companyName, "$"].join(""), 'i'), isDeleted: false }).lean()

        if (isUserExist) {
          throw new CustomError(USER_ERROR.USER_EXIST, 400)
        }

        if (company) {
          throw new CustomError(COMPANY_ERROR.COMPANY_EXIST, 400)
        }

        let counter = await models.Counter.findOneAndUpdate(
          { module: DBCollectionNames.COMPANY },
          { $inc: { seq_value: 1 } },
          {
            new: true,
            upsert: true
          }
        ).lean()

        let prefix = ModulePrefix.COMPANY;
        let userId = GeneralHelpers.getNewMongoDB_ObjectId()

        let companyDetails = await models.Company.create({
          name: input?.companyName?.trim(),
          uniqueCode: `${prefix}${counter.seq_value.toString()}`,
          status: CompanyStatus.ACTIVE,
          reviewStatus: CompanyReviewStatus.PENDING,
          type: input?.companyType,
          isDeleted: false,
          createdBy: userId,
          modifiedBy: userId
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
          _id: userId,
          email: input?.email?.trim(),
          password: input?.password,
          firstName: input?.firstName,
          lastName: input?.lastName,
          company: companyDetails._id,
          role: roleAdminDetails._id,
          status: UserStatus.CREATED,
          isDeleted: false,
          isCompany: true,
          createdBy: userId,
          modifiedBy: userId
        });

        await models.CompanySetting.create({
          company: companyDetails._id,
          themeSettings: defaultThemeSettings,
          createdBy: userDetails._id,
          modifiedBy: userDetails._id,
          isDeleted: false
        })

        try {
          const token = uuidv4()

          await EmailHelper.emailNotification({
            //senderName: user?._id,
            body: EmailTemplates.welcomeEmail({
              // companyName: user.company?.name,
              link: `${origin}/verify-email?token=${token}`,
              userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null

              // company: user.company,
              // userData: user
            }),
            to: userDetails.email,
            subject: `Welcome to ProCat360 - Your 3D Catalog Management Solution`,

            // source: `${user.email}`,
          });

          // generate uuid for token
          await models.Session.create({ token, user: userDetails?._id, company: userDetails?.company, type: "verify_email" });
        } catch (error) {

        }

        return userDetails;

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    },

    signIn: async (root, { input }, { origin, sourceIP }) => {
      const user = await models.User.findOne({ email: input?.email?.trim(), isDeleted: false }).populate("role").populate("company")
      if (!user) {
        throw new CustomError(USER_ERROR.SIGN_IN_EMAIL_NOT_FOUND, 400)
      }
      const isValid = await user.validatePassword(input?.password);
      if (!isValid) {
        throw new CustomError(USER_ERROR.INVALID_PASSWORD, 400)
      } else if (user?.role?.isDeleted) {
        throw new CustomError(USER_ERROR.NOT_FOUND, 400)
      } else if (user?.company?.isDeleted) {
        throw new CustomError(COMPANY_ERROR.NOT_FOUND, 400)
      } else if (!user?.verified) {
        throw new CustomError(USER_ERROR.USER_NOT_VERIFIED, 400)
      } else if (![CompanyStatus.ACTIVE, CompanyStatus.INVITED]?.includes(user?.company?.status)) {
        throw new CustomError(USER_ERROR.COMPANY_ACCOUNT_INACTIVE, 400)
      } else if (![UserStatus.ACTIVE, UserStatus.INVITED]?.includes(user?.status)) {
        throw new CustomError(USER_ERROR.USER_ACCOUNT_INACTIVE, 400)
      } else {
        if (user?.status === UserStatus.INVITED) {
          models.User.findByIdAndUpdate(user?._id, { status: UserStatus.ACTIVE, isEnrolled: true }).lean().exec()
        }

        if (user?.company?.status === CompanyStatus.INVITED) {
          models.Company.findByIdAndUpdate(user?.company?._id, { status: CompanyStatus.ACTIVE }).lean().exec()
        }

        const token = issueNewToken({ _id: user?._id, email: user?.email, role: user?.role?._id, company: user?.company?._id })
        const getIpDetails = await axios.get(`https://ipapi.co/${sourceIP}/json`)

        const sessionObj = {
          token,
          user: user?._id,
          company: user?.company?._id,
          role: user?.role?._id,
          city: getIpDetails?.data?.city,
          region: getIpDetails?.data?.region,
          country: getIpDetails?.data?.country_name,
          isMobile: input?.isMobile,
          browser: input?.browser,
          os: input?.os,
        }

        await models.Session.create(sessionObj)

        return {
          token,
          user,
        };
      }
    },

    signOut: combineResolvers(isAuthenticated, async (root, { id, token, isLogoutFromAll = false }, { user }) => {
      if (isLogoutFromAll) {
        await models.Session.deleteMany({ type: "access_token", user: user?._id, token: { $ne: token } })
      } else {
        const getSession = await models.Session.findOne({ $or: [{ _id: id }, { token }], company: user?.company, type: "access_token" }).lean()
        if (!getSession) {
          throw new CustomError(USER_ERROR.NOT_FOUND, 400)
        }
        await models.Session.deleteOne({ _id: getSession?._id })
      }

      return true
    }),

    switchToAccount: combineResolvers(isAuthenticated, async (root, { input }, { user, sourceIP }) => {
      await models.Session.deleteOne({ token: input?.token, type: "access_token" })
      const getCompanyUser = await models.User.findOne({ company: input?.id, isCompany: true }).populate("role").populate("company").lean()

      const newToken = issueNewToken({ _id: getCompanyUser?._id, email: getCompanyUser?.email, role: getCompanyUser?.role?._id, company: getCompanyUser?.company?._id })
      const getIpDetails = await axios.get(`https://ipapi.co/${sourceIP}/json`)

      const sessionObj = {
        token: newToken,
        user: getCompanyUser?._id,
        company: getCompanyUser?.company?._id,
        role: getCompanyUser?.role?._id,
        city: getIpDetails?.data?.city,
        region: getIpDetails?.data?.region,
        country: getIpDetails?.data?.country_name,
        isMobile: input?.isMobile,
        browser: input?.browser,
        os: input?.os,
        isGodUser: true
      }

      await models.Session.create(sessionObj)

      return {
        token: newToken,
        user: {
          ...getCompanyUser,
          role: {
            ...getCompanyUser?.role,
            godUsers: true
          }
        },
      };
    }),

    verifyEmail: async (root, { token }, { origin, sourceIP }) => {
      const getSession = await models.Session.findOne({ token, "type": "verify_email" });
      if (!getSession) {
        throw new CustomError(GENERAL_ERROR.INVALID_LINK, 400);
      }

      try {
        await models.User.updateOne({ _id: getSession?.user }, { $set: { verified: true, status: 'active' } })
        await models.Session.deleteMany({ "type": "verify_email", user: getSession?.user })

        return true;
      } catch (error) {
        return false;
      }
    },

    resendEmailVerificationLink: async (root, { email }, { origin, sourceIP }) => {
      const user = await models.User.findOne({ email: email?.trim(), isDeleted: false }).lean()

      if (!user) {
        throw new CustomError(USER_ERROR.NOT_FOUND, 400)
      }

      const token = uuidv4()
      await EmailHelper.emailNotification({
        //senderName: user?._id,
        body: EmailTemplates.verifyEmail({
          // companyName: user.company?.name,
          link: `${origin}/verify-email?token=${token}`,
          newEmail: email,
          userName: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null

          // company: user.company,
          // userData: user
        }),
        to: email,
        subject: `Your ProCat360 Email Address Update`,

        // source: `${user.email}`,
      });

      // generate uuid for token
      await models.Session.create({ token, user: user?._id, company: user?.company, type: "verify_email" });

      return true
    },

    forgotPassword: async (root, { email }, { origin, sourceIP }) => {
      const user = await models.User.findOne({ email: email?.trim(), isDeleted: false }).populate('company').lean()

      // if (!user) {
      //   throw new CustomError(USER_ERROR.NOT_FOUND, 400)
      // }

      if (user) {
        try {
          const token = uuidv4()
          await EmailHelper.emailNotification({
            //senderName: user?._id,
            body: EmailTemplates.resetPassword({
              link: `${origin}/reset-password?token=${token}`,
              userName: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null
            }),
            to: user.email,
            subject: `Reset Your ProCat360 Password`,

            // source: `${user.email}`,
          });

          // generate uuid for token
          await models.Session.create({ token, user: user?._id, company: user?.company, type: "reset_password" });
        } catch (error) {
          return false
        }
      }
    },

    resetPassword: async (root, { token, userId, password, enrollment = false }, { origin, sourceIP }) => {
      let getSession;
      if (token) {
        getSession = await models.Session.findOne({ token, type: enrollment ? "enrollment" : "reset_password" });
        if (!getSession) {
          throw new CustomError(GENERAL_ERROR.INVALID_LINK, 400);
        }
      }

      try {
        const user = await models.User.findOne({ _id: (userId || getSession?.user), isDeleted: false })
        const company = await models.Company.findOne({ _id: user?.company, isDeleted: false })
        if (enrollment) {
          user.isEnrolled = true
          user.status = 'active';
          company.status = 'active';
        }
        user.password = password
        await user?.save()
        await company?.save()

        if (token) {
          await models.Session.deleteMany({ "type": enrollment ? "enrollment" : "reset_password", user: getSession?.user })
        }

        return true;
      } catch (error) {
        return false;
      }

    },

    changePassword: combineResolvers(isAuthenticated, async (root, { oldPassword, newPassword }, { user }) => {
      try {
        const userData = await models.User.findOne({ _id: user._id, isDeleted: false })
        if (!userData) {
          throw new CustomError(USER_ERROR.NOT_FOUND, 400)
        }
        const isValid = await userData.validatePassword(oldPassword);
        if (!isValid) {
          throw new CustomError(USER_ERROR.PASSWORD_NOT_MATCH, 400)
        } else if (oldPassword === newPassword) {
          throw new CustomError(USER_ERROR.PASSWORD_CAN_NOT_SAME, 400)
        }
        else {
          userData.password = newPassword
          await userData.save()

          return true
        }

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),

    changeEmail: combineResolvers(isAuthenticated, async (root, { email }, { user, origin }) => {

      const userData = await models.User.findOne({ _id: user._id, isDeleted: false }).lean()
      if (!userData) {
        throw new CustomError(USER_ERROR.NOT_FOUND, 400)
      }
      const userEmail = email?.toLowerCase()?.trim()
      if (userData?.email === userEmail) {
        throw new CustomError(USER_ERROR.USER_EMAIL_EXIST, 400)
      } else {
        const isUserExist = await models.User.findOne({ email: userEmail, isDeleted: false }).lean()
        if (isUserExist) {
          throw new CustomError(USER_ERROR.USER_EMAIL_EXIST, 400)
        } else {
          try {
            const token = uuidv4()
            await EmailHelper.emailNotification({
              //senderName: user?._id,
              body: EmailTemplates.verifyEmail({
                // companyName: user.company?.name,
                link: `${origin}/verify-email?token=${token}`,
                newEmail: email,
                userName: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null

                // company: user.company,
                // userData: user
              }),
              to: email,
              subject: `Your ProCat360 Email Address Update`,

              // source: `${user.email}`,
            });

            // generate uuid for token
            await models.User.updateOne({ _id: userData._id, isDeleted: false }, { $set: { email: userEmail, verified: false } })
            await models.Session.deleteMany({ user: userData?._id })
            await models.Session.create({ token, user: userData?._id, company: userData?.company, type: "verify_email" });

            return true
          } catch (e) {
            throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
          }
        }
      }
    }),

    updateUserProfile: combineResolvers(isAuthenticated, async (root, { input }, { user }) => {
      try {
        const userData = await models.User.findOne({ _id: user._id, isDeleted: false })
        if (!userData) {
          throw new CustomError(USER_ERROR.NOT_FOUND, 400)
        }

        await models.User.updateOne(
          {
            _id: userData._id
          },
          {
            $set: {
              firstName: input?.firstName,
              lastName: input?.lastName,
              phone: input?.phone,
              avatar: input?.avatar,
              email: input?.email?.trim(),
              modifiedBy: user._id
            }
          }
        )
        const returnData = await models.User.findOne({ _id: userData._id }).lean().exec()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    })
  }
}