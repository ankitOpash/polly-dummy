import { v4 as uuidv4 } from 'uuid';
import models from "src/apollo/server/models"
import { GeneralHelpers } from "src/apollo/server/helpers/GeneralHelpers"
import { CustomError } from "src/apollo/server/utils/customError"
import { GENERAL_ERROR, USER_ERROR } from "src/apollo/server/utils/errorMessages"
import { EmailHelper } from "../../helpers/EmailHelpers"
import { EmailTemplates } from "../../utils/EmailTemplates"
import { combineResolvers } from 'graphql-resolvers';
import { hasPermission } from "src/apollo/server/resolvers/Common/resolvers"
import { UserStatus } from 'src/constants/user-const'
import ActivityHelpers from "src/apollo/server/helpers/ActivityHelpers"
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

export const resolvers = {

    Query: {

        getTeams: combineResolvers(hasPermission('Teams', 'view'), async (_, { input }, { user }) => {
            try {
                // FILTERING //
                let filter = JSON.parse(input?.filter || "{}")
                filter.company = user?.company;

                const filterText = GeneralHelpers.filterSearchQuery(input?.search, "userTbl")
                filter = { ...filter, ...filterText, _id: { $ne: user?._id }, isCompany: false }

                // SORTING //
                let sort = { createdAt: -1 }
                if (input?.sort?.key) {
                    let sortKey = input?.sort?.key

                    const renameSortKey = {
                        createdBy: "createdByUserName",
                        role: "role"
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
                            from: "roles",
                            localField: "role",
                            foreignField: "_id",
                            as: "roleData"
                        }
                    },
                    {
                        $addFields: {
                            createdBy: { $first: "$createdByData" },
                            createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
                            role: { $first: "$roleData" },
                        }

                    }
                ]

                const returnData = await models.User.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input), { collation: { locale: "en" } })

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

        addTeam: combineResolvers(hasPermission('Teams', 'create'), async (_, { input }, { user, origin }) => {
            try {
                const teamData = {
                    firstName: capitalizeFirstLetter(input.firstName),
                    lastName: capitalizeFirstLetter(input.lastName),
                    phone: input.phone,
                    email: input.email.trim().toLowerCase(),
                    password: input.password,
                    role: input.role,
                    status: input.status,
                    createdBy: user?._id,
                    company: user.company,
                    verified: true,
                }

                // EMAIL ALREADY EXIST //
                const isUserExist = await models.User.findOne({ email: input?.email?.trim(), isDeleted: false }).lean()
                if (!isUserExist) {
                    const newUser = await models.User.create(teamData)

                    const token = uuidv4()
                    await EmailHelper.emailNotification({
                        //senderName: user?._id,
                        body: EmailTemplates.inviteTeam({
                            // companyName: user.company?.name,
                            link: `${origin}/reset-password?token=${token}&enrollment=true`,
                            userData: {
                                userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
                                invitedBy: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null,
                                email: input.email.trim().toLowerCase(),
                                password: input.password,
                            }

                            // company: user.company,
                            // userData: user
                        }),
                        to: newUser.email,
                        subject: `Join ${user?.firstName ? `${user?.firstName} ${user?.lastName}` : null}'s ProCat360 Team`,

                        // source: `${user.email}`,
                    });

                    // generate uuid for token
                    await models.Session.create({ token, user: newUser?._id, company: newUser?.company, type: "enrollment" });

                    return newUser;

                } else {
                    throw new CustomError(USER_ERROR.USER_EXIST, 400)
                }
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),

        updateTeam: combineResolvers(hasPermission('Teams', 'edit'), async (root, { input }, { user, origin }) => {
            try {
                const token = uuidv4()
                const getFilterUser = await models.User.findById(input._id)

                // UPDATE DATA //
                if (input?.password) {
                    getFilterUser.password = input?.password
                    await getFilterUser?.save()
                }

                const returnData = await models.User.findOneAndUpdate({
                    _id: input._id,
                    isDeleted: false
                },
                    {
                        $set: {
                            firstName: capitalizeFirstLetter(input.firstName),
                            lastName: capitalizeFirstLetter(input.lastName),
                            email: input.email,
                            phone: input.phone,
                            role: input.role,
                            status: input.status,
                            modifiedBy: user?.id
                        }
                    },
                    {
                        new: true
                    }
                )

                // EMAIL IS NOT SAME THEN SEND MAIL //
                if (input.email !== getFilterUser.email) {
                    await EmailHelper.emailNotification({
                        //senderName: user?._id,
                        body: EmailTemplates.inviteTeam({
                            // companyName: user.company?.name,
                            origin,
                            link: `${origin}/reset-password?token=${token}&enrollment=true`,
                            userData: {
                                userName: input?.firstName ? `${input?.firstName} ${input?.lastName}` : null,
                                invitedBy: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null
                            }

                            // company: user.company,
                            // userData: user
                        }),
                        to: returnData.email,
                        subject: `Join ${user?.firstName ? `${user?.firstName} ${user?.lastName}` : null}'s ProCat360 Team`,

                        // source: `${user.email}`,
                    });

                    // generate uuid for token
                    await models.Session.updateOne({ token, user: returnData?._id, company: returnData?.company, type: "enrollment" });
                }

                return returnData

            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),

        deleteTeam: combineResolvers(hasPermission('Teams', 'delete'), async (root, { input }, { user }) => {
            try {

                let getTeams = await models.User.find({ _id: { $in: input?.ids, $ne: user?._id } }).lean()
                let allIds = getTeams?.map(d => d?._id)
                let result = await models.User.updateMany({ _id: { $in: allIds } }, { $set: { isDeleted: true } })
                await models.Session.deleteMany({ user: { $in: allIds } })

                let deletedCount = result.matchedCount;
                const deletedList = []
                getTeams?.map((team) => {
                    deletedList.push({
                        _id: team?._id,
                        relatedToText: `${team?.firstName} ${team?.lastName}`,
                        message: ActivityHelpers.message({
                            relatedToText: `${team?.firstName} ${team?.lastName}`,
                            messageType: ActivityHelpers.messageTypes.TEAMS_DELETE
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

        updateTeamStatus: combineResolvers(hasPermission('Teams', 'edit'), async (root, { status, id }, { user }) => {
            try {

                let returnData = await models.User.findOneAndUpdate({ _id: id }, { status, modifiedBy: user._id, ...(status === UserStatus.ACTIVE && { verified: true }) }).lean().exec()
                if (returnData && status === UserStatus.INACTIVE) {
                    await models.Session.deleteMany({ user: returnData._id })
                }

                return returnData
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }

        }),
    }

}