import { combineResolvers } from "graphql-resolvers";
import { hasPermission } from "../Common/resolvers";
import models from "../../models";
import { GENERAL_ERROR, GRADE_ERROR } from "../../utils/errorMessages";
import { CustomError } from "../../utils/customError";
import mongoose from "mongoose";
import { GeneralHelpers } from "../../helpers/GeneralHelpers";
import ActivityHelpers from "../../helpers/ActivityHelpers";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

const { ObjectId } = mongoose.Types

export const resolvers = {
    Query: {
        getAllGrade: combineResolvers(hasPermission('Grade', 'view'), async (_, { input }, { user }) => {
            try {
                //filtering//
                let filter = JSON.parse(input?.filter || "{}")

                const filterText = GeneralHelpers.filterSearchQuery(input?.search, "GradeTbl")
                filter = { ...filter, ...filterText }

                //sorting//

                let sort = { createdAt: -1 }
                if (input?.sort?.key) {
                    let sortKey = input?.sort?.key

                    const renameSortKey = {
                        grade: "tempGradeName",
                        createdBy: "tempCreatedByUserName"
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
                            tempGradeName: { $toUpper: "$grade" },
                        }
                    }
                ]

                const filterName = { company: user.company, isDeleted: false }
                filter = { ...filter, ...filterName }

                const returnData = await models.MaterialGrade.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

                return {
                    count: returnData?.[0]?.metadata[0]?.total || 0,
                    data: returnData?.[0]?.data || [],
                }
            }
            catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        }),
        getAllGradeWithoutPagination: combineResolvers(hasPermission('Grade', 'view'), async (_, args, { user }) => {
            try {
                const returnData = await models.MaterialGrade.find({ company: user.company, isDeleted: false, ...(args.search && { grade: { $regex: args?.search, $options: "i" } }) }).sort({ grade: 1 })

                return returnData
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        })
    },
    Mutation: {
        createGrade: combineResolvers(hasPermission('Grade', 'create'),
            async (_, { grade }, { user }) => {
                try {
                    const grades = await models.MaterialGrade.findOne({ grade: capitalizeFirstLetter(grade), company: user.company, isDeleted: false })
                    if (grades) {
                        throw new CustomError(GRADE_ERROR.GRADE_EXIST, 400)
                    } else {
                        let newGrade = await models.MaterialGrade.create({
                            grade: capitalizeFirstLetter(grade),
                            company: user.company,
                            createdBy: user._id,
                            modifiedBy: user?._id
                        })

                        return newGrade
                    }
                } catch (e) {
                    throw new CustomError(e.message || GRADE_ERROR.UNKNOWN, e.code || 400)
                }
            }
        ),
        deleteGrade: combineResolvers(hasPermission('Grade', 'delete'), async (_, { id }, { user }) => {
            try {
                const grade = await models.MaterialGrade.find({ _id: { $in: id }, company: user.company, isDeleted: false })
                if (!grade) {
                    throw new CustomError(GRADE_ERROR.GRADE_NOT_FOUND, 400)
                } else {
                    let result = await models.MaterialGrade.updateMany({ _id: { $in: id }, company: new ObjectId(user.company) }, { $set: { isDeleted: true } }).exec()
                    let deletedCount = result.matchedCount;
                    const deletedList = []
                    grade?.map((grade) => {
                        deletedList.push({
                            _id: grade?._id,
                            relatedToText: `${grade?.grade}`,
                            message: ActivityHelpers.message({
                                relatedToText: `${grade?.grade}`,
                                messageType: ActivityHelpers.messageTypes.GRADES_DELETE
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
        updateGrade: combineResolvers(hasPermission('Grade', 'update'), async (_, { id, grade }, { user }) => {
            try {
                const isGradeExist = await models.MaterialGrade.findOne({ _id: id, company: user.company, isDeleted: false })
                if (!isGradeExist) {
                    throw new CustomError(GRADE_ERROR.GRADE_NOT_FOUND, 400)
                }
                if (isGradeExist.grade !== capitalizeFirstLetter(grade)) {
                    const gradewithSameName = await models.MaterialGrade.findOne({
                        _id: { $ne: isGradeExist._id },
                        grade: capitalizeFirstLetter(grade),
                        company: user.company,
                        isDeleted: false
                    }).lean().exec()

                    if (gradewithSameName) {
                        throw new CustomError(GRADE_ERROR.GRADE_EXIST, 400)
                    }
                }

                await models.MaterialGrade.updateOne({ _id: isGradeExist._id }, {
                    $set: {
                        grade: capitalizeFirstLetter(grade),
                        modifiedBy: user?._id
                    }
                })

                const returnUpdatedData = await models.MaterialGrade.findOne({ _id: isGradeExist._id }).lean().exec()

                return returnUpdatedData
            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
            }
        })
    }
}
