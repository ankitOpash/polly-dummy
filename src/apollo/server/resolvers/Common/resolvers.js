import { AuthenticationError, ForbiddenError } from 'apollo-server-micro';
import { skip, combineResolvers } from 'graphql-resolvers';
import { AUTH_ERROR } from "src/apollo/server/utils/errorMessages";

export const isAuthenticated = (parent, args, { user }) =>
  user ? skip : new AuthenticationError(AUTH_ERROR.UNAUTHORIZED);

export const hasPermission = (moduleName, action) => combineResolvers(isAuthenticated, (parent, args, { user }) => {
  if (!["Admin", "GOD"]?.includes(user?.role?.name)) {
    let userPermissions = user?.role?.permissions?.find(permission => permission?.moduleName === moduleName);
    if (userPermissions) {
      if (!userPermissions[action] || userPermissions[action] === false) {
        return new ForbiddenError(AUTH_ERROR.ACCESS_DENIED)
      }
    } else {
      return new ForbiddenError(AUTH_ERROR.ACCESS_DENIED)
    }
  } else {
   return skip
  }
})
