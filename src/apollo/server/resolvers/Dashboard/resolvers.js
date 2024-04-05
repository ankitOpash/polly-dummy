import { combineResolvers } from "graphql-resolvers";
import { hasPermission } from "../Common/resolvers";
import { CustomError } from "../../utils/customError";
import { GENERAL_ERROR } from "../../utils/errorMessages";
import models from "../../models";

export const resolvers = {
  Query: {
    getModuleItemsCountsForDashboard: combineResolvers(hasPermission('Dashboard', 'view'), async (_, { }, { user }) => {
      try {
        const productCounts = await models.Product.countDocuments({ company: user.company, isDeleted: false })
        const materialCounts = await models.Material.countDocuments({ company: user.company, isDeleted: false })
        const partsCounts = await models.Part.countDocuments({ company: user.company, isDeleted: false })
        const configuratorCounts = await models.Configurator.countDocuments({ company: user.company, isDeleted: false })

        return {
          productCounts,
          materialCounts,
          partsCounts,
          configuratorCounts
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }),
  },
}