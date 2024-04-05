import ActivityHelpers from "../../helpers/ActivityHelpers"
import { GeneralHelpers } from "../../helpers/GeneralHelpers"
import models from "../../models"
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter"
import { CustomError } from "../../utils/customError"
import { GENERAL_ERROR, TAG_ERROR } from "../../utils/errorMessages"
import { hasPermission } from "../Common/resolvers"
import { combineResolvers } from "graphql-resolvers"
import mongoose from "mongoose"

const { ObjectId } = mongoose.Types;


export const resolvers = {
    Query: {
        getAllTags: combineResolvers(hasPermission('Tags', 'view'), async (_, { input }, { user }) => {
            try {

                let filter = JSON.parse(input?.filter || "{}")

                const filterText = GeneralHelpers.filterSearchQuery(input?.search, "TagsTbl")
                filter = { ...filter, ...filterText }

                let sort = { createdAt: -1 }
                if (input?.sort?.key) {
                    let sortKey = input?.sort?.key

                    const renameSortKey = {
                        name: "tempTagName",
                        createdBy: "createdByUserName"
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
                            tempTagName: { $toUpper: "$name" },
                        }
                    }
                ]

                const filterName = { company: user.company, isDeleted: false }
                filter = { ...filter, ...filterName }

                const returnData = await models.Tag.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

                return {
                    count: returnData?.[0]?.metadata[0]?.total || 0,
                    data: returnData?.[0]?.data || [],
                }
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),
        getAllTagWithoutPagination: combineResolvers(hasPermission('Tags', 'view'), async (_, args, { user }) => {
            try {
                const returnData = await models.Tag?.find({ company: user.company, isDeleted: false }).limit(args.limit);

                return { count: returnData.length || 0, data: returnData || [] }

            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        })
    },
    Mutation: {
        createTags: combineResolvers(hasPermission('Tags', 'create'), async (root, { name }, { user }) => {
            try {

                const tag = await models.Tag.findOne({ name: capitalizeFirstLetter(name), company: user.company, isDeleted: false })
                if (tag) {
                    throw new CustomError(TAG_ERROR.TAG_EXIST, 400)
                } else {
                    let newTag = await models.Tag.create({
                        name: capitalizeFirstLetter(name),
                        company: user.company,
                        createdBy: user._id,
                    })

                    return newTag

                }
            } catch (e) {
                throw new CustomError(e.message || TAG_ERROR.UNKNOWN, e.code || 400)
            }
        }),
        deleteTags: combineResolvers(hasPermission('Tags', 'delete'), async (root, { id }, { user }) => {
            try {

                const tag = await models.Tag.find({ _id: { $in: id }, company: user.company, isDeleted: false })
                if (!tag) {
                    throw new CustomError(TAG_ERROR.TAG_NOT_FOUND, 400)
                }
                else {
                    let result = await models.Tag.updateMany({ _id: { $in: id }, company: new ObjectId(user.company) }, { $set: { isDeleted: true } }).exec()
                    let deletedCount = result.matchedCount;
                    const deletedList = []
                    tag?.map((tag) => {
                        deletedList.push({
                            _id: tag?._id,
                            relatedToText: `${tag?.name}`,
                            message: ActivityHelpers.message({
                                relatedToText: `${tag?.name}`,
                                messageType: ActivityHelpers.messageTypes.TAGS_DELETE
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
        updateTags: combineResolvers(hasPermission('Tags', 'edit'), async (root, { id, name }, { user }) => {
            try {

                const tag = await models.Tag.findOne({ _id: { $in: id }, company: user.company, isDeleted: false })
                if (!tag) {
                    throw new CustomError(TAG_ERROR.TAG_NOT_FOUND, 400)
                }
                if (tag.name !== capitalizeFirstLetter(name)) {
                    const tagWithSameName = await models.Tag.findOne({
                        _id: { $ne: tag._id },
                        name: capitalizeFirstLetter(name),
                        company: user.company, 
                        isDeleted: false
                    }).lean().exec()
                    if (tagWithSameName) {
                        throw new CustomError(TAG_ERROR.TAG_EXIST, 400)
                    }
                }

                await models.Tag.updateOne(
                    { _id: tag._id }
                    , {
                        $set: {
                            name: capitalizeFirstLetter(name),
                            modifiedBy: user?._id
                        }
                    })

                const returnUpdatedData = await models.Tag.findOne({ _id: tag._id }).lean().exec()

                return returnUpdatedData
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        })

    }
}