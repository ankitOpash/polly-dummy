import { combineResolvers } from "graphql-resolvers";
import { hasPermission } from "../Common/resolvers";
import models from "../../models";
import { CustomError } from "../../utils/customError";
import { GENERAL_ERROR, PART_ERROR } from "../../utils/errorMessages";
import { DBCollectionNames, ModulePrefix } from "src/constants/default-const";
import mongoose from "mongoose";
import ActivityHelpers from "../../helpers/ActivityHelpers";
import { GeneralHelpers } from "../../helpers/GeneralHelpers";
import lodash from 'lodash'
import { S3Helpers } from "../../helpers/S3Helpers";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";


const { ObjectId } = mongoose.Types;

export const resolvers = {
    Query: {
        getAllPart: combineResolvers(hasPermission('view', 'Parts'), async (_, { input }, { user }) => {
            try {

                //filtering//
                let filter = JSON.parse(input?.filter || "{}")

                const filterText = GeneralHelpers.filterSearchQuery(input?.search, "PartTbl")
                if (input.search && input.search.length) {
                    if (input.searchField) {
                        const searchOnField = input.searchField === "status" ? input?.search?.replaceAll(' ', '_') : input.search
                        if (input.searchField === 'category') {
                            input.searchField = 'parentCategory.categoryName'
                        }
                        filter['$or'] = [
                            { [input.searchField]: new RegExp(searchOnField, 'ig') }
                        ]
                    }
                }
                filter = { ...filter, ...filterText }

                //sorting//

                let sort = { createdAt: -1 }
                if (input?.sort?.key) {
                    let sortKey = input?.sort?.key

                    const renameSortKey = {
                        name: "tempPartName",
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
                        $lookup: {
                            from: 'admin_categories',
                            localField: 'parentCategory',
                            foreignField: '_id',
                            as: 'parentCategoryData',
                        },
                    },
                    {
                        $lookup: {
                            from: "company_categories",
                            localField: "category",
                            foreignField: "_id",
                            as: "subCategoryData"
                        }
                    },
                    {
                        $addFields: {
                            tempPartName: { $toUpper: "$name" },
                            tempCreatedByUserName: { $toUpper: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] } },
                            createdByUserName: { $concat: [{ $first: "$createdByData.firstName" }, " ", { $first: "$createdByData.lastName" }] },
                            createdBy: { $first: "$createdByData" },
                            category: {
                                _id: '$category',
                                categoryName: { $first: '$subCategoryData.category.categoryName' },
                            },
                            parentCategory: {
                                _id: '$parentCategory',
                                categoryName: { $first: '$parentCategoryData.categoryName' },
                            }
                        }
                    }
                ]
                const filterName = { company: user.company, isDeleted: false }
                filter = { ...filter, ...filterName }
                const returnData = await models.Part.aggregate(GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input))

                return {
                    count: returnData?.[0]?.metadata[0]?.total || 0,
                    data: returnData?.[0]?.data || [],
                }


            } catch (e) {
                throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
            }
        })
        ,
        getPartDetailById: combineResolvers(hasPermission('view', 'Part'), async (_, { id }, { user }) => {
            try {
                const part = await models.Part.findById(id).populate("tags").populate({
                    path: 'parentCategory',
                }).populate({
                    path: 'category',
                }).lean()

                if (part.parentCategory) {
                    part.parentCategory['_id'] = part?.parentCategory?._id
                    part.parentCategory['categoryName'] = part?.parentCategory?.categoryName
                }
                if (part.category) {
                    part.category['_id'] = part?.category?._id
                    part.category['categoryName'] = part?.category?.category?.categoryName
                    part.category['categoryId'] = part?.category?.category?.categoryId
                }

                return part
            } catch (e) {
                throw new CustomError(e.message || PART_ERROR.UNKNOWN, e.code || 405)
            }
        })
    },
    Mutation: {
        createPart: combineResolvers(hasPermission('create', 'Part'), async (_, { data }, { user }) => {
            try {
                data.name = capitalizeFirstLetter(data.name)
                const isPartExist = await models.Part.findOne({ name: data.name, company: user.company, isDeleted: false })
                const isSkuExist = await models.Part.findOne({ sku: data.sku.trim(), company: user.company, isDeleted: false })
                if (isPartExist) {
                    throw new CustomError(PART_ERROR.PART_EXIST, 405)
                } else if (isSkuExist) {
                    throw new CustomError(PART_ERROR.SKU_EXIST, 405)
                }
                else {
                    let prefix = ModulePrefix.PART;

                    let counter = await models.Counter.findOneAndUpdate(
                        { module: DBCollectionNames.PART, company: user.company },
                        { $inc: { seq_value: 1 } },
                        {
                            new: true,
                            upsert: true
                        }
                    ).lean()

                    let newPart = await models.Part.create({
                        name: data.name,
                        sku: data.sku,
                        uniqueCode: `${prefix}${counter.seq_value.toString()}`,
                        images: data.images,
                        description: data.description,
                        thumb: data.thumb,
                        status: data?.status,
                        visibilityStatus: data.visibilityStatus,
                        parentCategory: data.parentCategory,
                        category: data.category,
                        attributes: data.attributes,
                        tags: data.tags,
                        company: user.company,
                        createdBy: user?._id,
                        modifiedBy: user?._id
                    })

                    return newPart
                }
            } catch (e) {
                throw new CustomError(e.message || PART_ERROR.UNKNOWN, e.code || 405)
            }
        }),
        deletePart: combineResolvers(hasPermission('delete', 'Part'),
            async (_, { id }, { user }) => {
                try {
                    const part = await models.Part.find({ _id: { $in: id }, company: user.company, isDeleted: false })
                    if (!part) {
                        throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
                    } else {
                        let result = await models.Part.updateMany({ _id: { $in: id }, company: new ObjectId(user.company) }, { $set: { isDeleted: true } }).exec()
                        let deletedCount = result.matchedCount
                        const deletedList = []
                        part?.map((prt) => {
                            deletedList.push({
                                _id: prt?._id,
                                relatedToText: `${prt?.name}`,
                                message: ActivityHelpers.message({
                                    relatedToText: `${prt?.name}`,
                                    messageType: ActivityHelpers.messageTypes.PARTS_DELETE
                                })
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
                    throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
                }
            }),
        updatePart: combineResolvers(hasPermission('update', 'Part'),
            async (_, { id, data }, { user }) => {
                try {
                    const isPartExist = await models.Part.findOne({ _id: id, company: user.company, isDeleted: false })
                    if (!isPartExist) {
                        throw new CustomError(PART_ERROR.PART_NOT_FOUND, 405)
                    }

                    if (isPartExist.name !== data.name) {
                        const partWithSameName = await models.Part.findOne({
                            _id: { $ne: isPartExist._id },
                            name: data.name,
                            company: user.company,
                            isDeleted: false
                        }).lean().exec()

                        if (partWithSameName) {
                            throw new CustomError(PART_ERROR.PART_EXIST, 405)
                        }
                    }
                    if (isPartExist.sku !== data.sku) {
                        const skuwithSameName = await models.Part.findOne({
                            _id: { $ne: isPartExist._id },
                            sku: data.sku
                        })

                        if (skuwithSameName) {
                            throw new CustomError(PART_ERROR.SKU_EXIST, 405)
                        }
                    }

                    await models.Part.updateOne(
                        { _id: isPartExist._id },
                        {
                            $set: {
                                name: data.name,
                                sku: data.sku,
                                images: data.images,
                                description: data.description,
                                thumb: data.thumb,
                                status: data?.status,
                                visibilityStatus: data.visibilityStatus,
                                parentCategory: data.categoryId,
                                category: data.category,
                                attributes: data.attributes,
                                tags: data.tags,
                                modifiedBy: user?._id
                            }
                        }
                    )
                    const returnData = await models.Part.findOne({ _id: isPartExist._id }).lean().exec()

                    let imagesToBeDeleted = lodash.difference(isPartExist.images || [], returnData.images || [])
                    if (imagesToBeDeleted && imagesToBeDeleted.length) {
                        let fileObjects = []
                        imagesToBeDeleted.forEach(img => {
                            const { filepath, filename } = extractFilePath(img)
                            fileObjects.push({ Key: `public/${img}` })
                            fileObjects.push({ Key: `public/${filepath}${filename}.webp` })
                        })
                        const s3 = S3Helpers.getS3Object()
                        await S3Helpers.removeFilesFromS3(s3, {
                            Bucket: process.env.APP_BUCKET,
                            Delete: {
                                Objects: fileObjects
                            }
                        })
                    }

                    return returnData

                } catch (e) {
                    throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 405)
                }
            })
    }
}