import models from "src/apollo/server/models"
import { GENERAL_ERROR } from "../../utils/errorMessages"
import { CustomError } from "../../utils/customError"
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from "src/apollo/server/resolvers/Common/resolvers"

export const resolvers = {
  Query: {
    getCompanySettings: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        const returnData = await models.CompanySetting.findOne({ company: user.company, isDeleted: false }).lean()

        return returnData
      } catch (error) {
        throw new CustomError(error.message || GENERAL_ERROR.UNKNOWN, error.code || 400)
      }
    })
  },

  Mutation: {
    updateThemeSetting: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        const returnData = await models.CompanySetting.findOneAndUpdate(
          {
            company: user.company,
            isDeleted: false
          },
          {
            $set: {
              themeSettings: {
                layout: input?.layout,
                layoutMode: input?.layoutMode,
                layoutWidth: input?.layoutWidth,
                layoutPosition: input?.layoutPosition,
                topBarTheme: input?.topBarTheme,
                sidebarSize: input?.sidebarSize,
                sidebarView: input?.sidebarView,
                sidebarTheme: input?.sidebarTheme,
                sidebarImage: input?.sidebarImage,
                preLoader: input?.preLoader,
                sidebarVisibility: input?.sidebarVisibility,
              },
              modifiedBy: user._id
            }
          },
          {
            new: true
          }
        ).lean()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    }),

    updateProductSetting: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        const returnData = await models.CompanySetting.findOneAndUpdate(
          {
            company: user.company,
            isDeleted: false
          },
          {
            $set: {
              productSettings: {
                markupPercentage: input?.markupPercentage,
                isConfigurable: input?.isConfigurable
              },
              modifiedBy: user._id
            }
          },
          {
            new: true
          }
        ).lean()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    }),
    updateEmailSettings: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {

        const returnData = await models.CompanySetting.findOneAndUpdate(
          {
            company: user.company,
            isDeleted: false
          },
          {
            $set: {
              emailSettings: {
                email: input?.email,
                firstName: input?.firstName,
                lastName: input?.lastName
              },
              modifiedBy: user._id
            }
          },
          {
            new: true
          }
        ).lean()

        return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    }),

    updateModelViewerSettings: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {


        let updateObject = {
          'modelViewerSettings.exposure.isActive': input.exposureStatus,
          'modelViewerSettings.exposure.value': input.exposureValue,
          'modelViewerSettings.shadowIntensity.isActive': input.shadowIntensityStatus,
          'modelViewerSettings.shadowIntensity.value': input.shadowIntensityValue,
          'modelViewerSettings.neutralLighting': input.neutralLighting,
          'modelViewerSettings.zoom': input.zoom,
          'modelViewerSettings.environmentImage': input.environmentImage,
          modifiedBy: user._id
        }

        const returnData = await models.CompanySetting.findOneAndUpdate(
          {
            company: user.company,
            isDeleted: false
          },
          {
            $set: updateObject
          },
          {
            new: true
          }
        ).lean()

        console.log('====returnData', returnData)
        
return returnData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }

    }),
  }
}