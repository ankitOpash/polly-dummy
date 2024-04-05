import models from 'src/apollo/server/models'
import { CustomError } from "src/apollo/server/utils/customError";
import { AUTH_ERROR } from "src/apollo/server/utils/errorMessages";

export const checkRole = async (action, moduleName, user) => {
  if (!["Admin", "GOD"]?.includes(user?.role?.name)) {
    const role = await models.Role.findOne({ _id: user.role?._id, isDeleted: false }).lean().exec()
    if (role) {
      let userPermissions = role?.permissions?.find(permission => permission?.moduleName === moduleName);
      if (userPermissions) {
        if (!userPermissions[action] || userPermissions[action] === false) {
          throw new CustomError(AUTH_ERROR.ACCESS_DENIED, 403)
        }
      } else {
        throw new CustomError(AUTH_ERROR.ACCESS_DENIED, 403)
      }
    } else {
      throw new CustomError(AUTH_ERROR.ACCESS_DENIED, 403)
    }
  }
}
