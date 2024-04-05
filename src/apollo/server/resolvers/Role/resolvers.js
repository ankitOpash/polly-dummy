import { GeneralHelpers } from "../../helpers/GeneralHelpers";
import { CustomError } from "../../utils/customError";
import { GENERAL_ERROR, ROLE_ERROR } from "../../utils/errorMessages";
import mongoose from "mongoose";
import models from "src/apollo/server/models"
import { combineResolvers } from 'graphql-resolvers';
import { hasPermission } from "src/apollo/server/resolvers/Common/resolvers"
import ActivityHelpers from "../../helpers/ActivityHelpers";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

const { ObjectId } = mongoose.Types;

export const resolvers = {
    Query: {
        getAllRole: combineResolvers(hasPermission('Roles', 'view'), async (_, { input }, { user }) => {

            try {

                //filtering//
                let filter = JSON.parse(input?.filter || "{}")

                const filterText = GeneralHelpers.filterSearchQuery(input?.search, "RoleTbl")
                filter = { ...filter, ...filterText }

                //sorting//

                let sort = { createdAt: -1 }
                if (input?.sort?.key) {
                    let sortKey = input?.sort?.key

                    const renameSortKey = {
                        createdBy: "tempCreatedByUserName",
                        name: "tempName"
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
                            tempCreatedByUserName: { $toUpper: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] } },
                            createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
                            tempName: { $toUpper: "$name" },
                        }
                    }
                ]
                const filterName = { name: { $exists: true, $nin: ["Admin", "GOD", user?.role?.name] }, company: user.company, isDeleted: false }
                filter = { ...filter, ...filterName }
                const returnData = await models.Role.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

                return {
                    count: returnData?.[0]?.metadata[0]?.total || 0,
                    data: returnData?.[0]?.data || [],
                }


            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),

        getAllRoleWithoutPagination: async (_, { input }, { user }) => {
            try {
                const populateQueries = [
                    { path: "name" }
                ]
                const returnData = await models.Role?.find({ company: user.company, isDeleted: false, name: { $ne: "GOD" } })

                return { count: returnData.length || 0, data: returnData || [] }

            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        },
        getUserRole: async (root, args, { user }) => {
            try {

                const role = await models.Role.findOne({ _id: user.role, isDeleted: false }).lean().exec()

                return role

            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }

    },
    Mutation: {
        createRole: combineResolvers(hasPermission('create', 'Roles'), async (root, { name, permissions }, { user }) => {
            try {
                const role = await models.Role.findOne({ name: capitalizeFirstLetter(name), company: user.company, isDeleted: false })
                if (role) {
                    throw new CustomError(ROLE_ERROR.ROLE_EXIST, 400)
                } else {
                    let newRole = await models.Role.create({
                        name: capitalizeFirstLetter(name),
                        permissions: permissions,
                        company: user.company,
                        createdBy: user._id,
                        modifiedBy: user?._id
                    })

                    return newRole

                }
            } catch (e) {
                throw new CustomError(e.message || ROLE_ERROR.UNKNOWN, e.code || 400)
            }
        }),
        deleteRole: combineResolvers(hasPermission('delete', 'Roles'), async (root, { id }, { user }) => {
            try {

                const roles = await models.Role.find({ _id: { $in: id }, company: user.company, isDeleted: false })
                if (!(roles && roles.length)) {
                    throw new CustomError(ROLE_ERROR.ROLE_NOT_FOUND, 400)
                }
                const users = await models.User.findOne({ role: id, isDeleted: false })
                if (users !== null) {
                    throw new CustomError(ROLE_ERROR.ROLE_ASIGN, 400)
                } else {
                    let result = await models.Role.updateMany({ _id: { $in: id }, company: new ObjectId(user.company) }, { $set: { isDeleted: true } }).exec()
                    let deletedCount = result.matchedCount;
                    const deletedList = []
                    roles?.map((role) => {
                        deletedList.push({
                            _id: role?._id,
                            relatedToText: `${role?.name}`,
                            message: ActivityHelpers.message({
                                relatedToText: `${role?.name}`,
                                messageType: ActivityHelpers.messageTypes.ROLES_DELETE
                            }),
                        })
                    })

                    return {
                        deletedCount,
                        deletedList,
                        rejectedList: [],
                        rejectedMessage: ""
                    }
                }

            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),

        updateRole: combineResolvers(hasPermission('edit', 'Roles'), async (root, { id, data }, { user }) => {
            try {
                const role = await models.Role.findOne({ _id: id, company: user.company, isDeleted: false }).exec()
                if (!role) {
                    throw new CustomError(ROLE_ERROR.ROLE_NOT_FOUND, 400)
                }

                if (role.name !== capitalizeFirstLetter(data.name)) {
                    const roleWithSameName = await models.Role.findOne({
                        _id: { $ne: role._id },
                        name: capitalizeFirstLetter(data.name),
                        company: user.company,
                        isDeleted: false
                    }).lean().exec()
                    if (roleWithSameName) {
                        throw new CustomError(ROLE_ERROR.ROLE_EXIST, 400)
                    }
                }

                await models.Role.updateOne(
                    { _id: role._id },
                    {
                        $set: {
                            name: capitalizeFirstLetter(data.name),
                            permissions: data.permissions,
                            modifiedBy: user?._id
                        }
                    }
                )
                const getSession = await models.Session.findOne({ type: "access_token", role: role?._id }).lean()
                if (!getSession) {
                    // throw new CustomError(ROLE_ERROR.ROLE_NOT_FOUND, 400)
                    null
                } else {
                    await models.Session.deleteMany({ type: "access_token", role: role?._id })
                }
                const returnData = await models.Role.findOne({ _id: role._id }).lean().exec()

                return returnData


            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),
    }

}