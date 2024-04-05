import jwt from 'jsonwebtoken'
import { AUTH_ERROR } from 'src/apollo/server/utils/errorMessages'
import { ActivityActions } from 'src/constants/activity-const'
import models from '../models'

let SECRET = 'my-middleware-secret'

export const checkToken = async event => {
  try {
    let token = event.headers['x-access-token'] || event.headers['Authorization'] || event.headers['authorization']
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }

      const getSession = await models.Session.findOne({ token }).lean()
      if (getSession) {
        const decoded = await jwt.verify(token, SECRET)

        const user = await models.User.findOne({ _id: decoded?._id, isDeleted: false })
          .populate('role')
          .populate({ path: 'company', populate: { path: 'companySettings', select: 'themeSettings' } })
          .lean()
        if (user && !user?.role?.isDeleted && !user?.company?.isDeleted) {
          return {
            ...user,
            companyObj: user?.company,
            company: user?.company?._id,
            role: {
              ...user?.role,
              godUsers: getSession?.isGodUser ?? user?.role?.godUsers
            }
          }
        } else {
          return null
        }
      } else {
        return null
      }
    }
  } catch (e) {
    throw new Error(e.message || AUTH_ERROR.UNKNOWN)
  }
}

export const issueNewToken = payload => {
  /** token
   *
   * @param {String} _id - user unique id
   * @param {String} email
   * @param {String} role
   * @param {String} company - user's company's unique id / user's current switched company's unique id
   */

  payload = payload || null
  payload && payload.iat ? delete payload.iat : null
  payload && payload.exp ? delete payload.exp : null

  let token = payload
    ? jwt.sign(payload, SECRET, { algorithm: 'HS512', expiresIn: process.env.TOKEN_EXPIRES_IN })
    : null

  return token
}

export const ActivityLogger = () => {
  return {
    requestDidStart({ request, context }) {
      return {
        async willSendResponse({ response }) {
          if (request.variables?.logInput && response) {
            const logInput = request.variables?.logInput
            const data = response.data[request.operationName]

            if (data) {
              let activityMetaData = {
                company: context?.user?.company,
                createdBy: context?.user?._id,
                modifiedBy: context?.user?._id
              }

              let dataToBeInsert = []

              if (logInput?.action === ActivityActions.CREATE) {
                dataToBeInsert.push({
                  ...activityMetaData,
                  action: logInput?.action,
                  actionOn: logInput?.actionOn,
                  actionId: data?._id,
                  oldValue: '',
                  newValue: JSON.stringify(data),
                  message: logInput?.message
                })
              }

              if (logInput?.action === ActivityActions.UPDATE) {
                dataToBeInsert.push({
                  ...activityMetaData,
                  action: logInput?.action,
                  actionOn: logInput?.actionOn,
                  actionId: JSON.parse(logInput?.oldValue)?._id,
                  oldValue: logInput?.oldValue || '',
                  newValue: JSON.stringify(data),
                  message: logInput?.message
                })
              }

              if (logInput?.action === ActivityActions.DELETE) {
                if (data?.deletedList?.length) {
                  data?.deletedList?.map(record => {
                    dataToBeInsert.push({
                      ...activityMetaData,
                      action: logInput?.action,
                      actionOn: logInput?.actionOn,
                      actionId: record?._id,
                      oldValue: '',
                      newValue: '',
                      message: record?.message
                    })
                  })
                }
              }

              try {
                if (dataToBeInsert?.length) {
                  await models.Activity.create(dataToBeInsert)
                }
              } catch (error) {
                console.error('Activity Error: ', error)
              }
            } else {
              return
            }
          }
        }
      }
    }
  }
}
