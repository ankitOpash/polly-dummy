import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "../Common/resolvers";
import { CustomError } from "../../utils/customError";
import { GENERAL_ERROR } from "src/apollo/server/utils/errorMessages"
import models from "src/apollo/server/models"
import { GeneralHelpers } from "../../helpers/GeneralHelpers";

export const resolvers = {
  Query: {
    getActivities: combineResolvers(isAuthenticated, async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || "{}")

        if (filter?.from) {
          filter = { ...filter, createdAt: { $gte: new Date(filter?.from) } }
        }

        if (filter?.to) {
          filter = { ...filter, createdAt: { $lt: new Date(filter?.to) } }
        }

        delete filter.from
        delete filter.to
        const filterText = GeneralHelpers.filterSearchQuery(input?.search, "activityTbl")
        filter = { ...filter, ...filterText, company: user?.company }

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
              createdByUserName: {
                $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }
                ]
              }
            }
          }
        ]
        const sort = { updatedAt: -1 }
        const returnData = await models.Activity.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || [],
        }

        return { data: returnData?.docs || [], count: returnData?.totalDocs || 0 }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  }
}