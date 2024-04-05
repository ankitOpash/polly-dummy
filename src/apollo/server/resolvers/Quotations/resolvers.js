import { GeneralHelpers } from '../../helpers/GeneralHelpers'
import models from '../../models'
import { CustomError } from '../../utils/customError'
import { GENERAL_ERROR, PRODUCT_ERROR } from '../../utils/errorMessages'
import ActivityHelpers from '../../helpers/ActivityHelpers'
import mongoose from 'mongoose'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

const { ObjectId } = mongoose.Types

export const resolvers = {
  MaterialsOrPart: {
    __resolveType(obj, contextValue, info) {
      return obj.type
    }
  },
  Query: {
    getAllQuotations: async (_, { input }, { user }) => {
      try {
        let filter = JSON.parse(input?.filter || '{}')

        let sort = { createdAt: -1 }
        const filterText = GeneralHelpers.filterSearchQuery(input?.search, 'QuotationTbl')
        if (input.search && input.search.length) {
          if (input.searchField) {
            if (input.searchField === 'customerName') {
              filter['$or'] = [
                { ['customerName.firstName']: new RegExp(input.search, 'ig') },
                { ['customerName.lastName']: new RegExp(input.search, 'ig') }
              ]
            } else if (input.searchField === 'price') {
              filter['$or'] = [{ ['paymentAmounts.totalAmount']: new RegExp(input.search, 'ig') }]
            } else {
              filter['$or'] = [{ [input.searchField]: new RegExp(input.search, 'ig') }]
            }
          }
        }
        filter = { ...filter, ...filterText }

        const populateQueries = [
          {
            $lookup: {
              from: 'products',
              localField: 'products',
              foreignField: '_id',
              as: 'populatedProducts'
            }
          },
          {
            $lookup: {
              from: 'customers',
              localField: 'customerName',
              foreignField: '_id',
              as: 'populatedCustomer'
            }
          },
          {
            $addFields: {
              products: '$populatedProducts',
              customerName: { $first: '$populatedCustomer' }
            }
          }
        ]

        const filterName = { createdBy: user.company, isDeleted: false }
        filter = { ...filter, ...filterName }

        const returnData = await models.Quotations.aggregate(
          GeneralHelpers.aggregatePaginate(populateQueries, filter, sort, input)
        )

        return {
          count: returnData?.[0]?.metadata[0]?.total || 0,
          data: returnData?.[0]?.data || []
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    },
    getQuotationDetailById: async (_, { id }, { user }) => {
      try {
        let quotation = await models.Quotations.findById(id).populate('products').populate('customerName').lean()

        return quotation
      } catch (e) {
        throw new CustomError(e.message || PRODUCT_ERROR.UNKNOWN, e.code || 400)
      }
    }
  },
  Mutation: {
    createQuotation: async (_, { data }, { user }) => {
      try {
        data.name = capitalizeFirstLetter(data?.name) || ''

        let newQuotation = await models.Quotations.create({
          name: data.name,
          customerName: data.customerName,
          address: data.address,
          invoiceNumber: data.invoiceNumber,
          date: data.date,
          paymentStatus: data.paymentStatus,
          totalAmount: data.totalAmount,
          billingAddress: data.billingAddress,
          shippingAddress: data.shippingAddress,
          products: data.products,
          hotTableData: data.hotTableData,
          paymentMethod: data.paymentMethod,
          paymentAmounts: data.paymentAmounts,
          notes: data.notes,
          createdBy: user?.company,
          extraFields: data.extraFields,
          extraTotalFields: data.extraTotalFields
        })

        return newQuotation
      } catch (e) {
        throw new CustomError(e.message || PRODUCT_ERROR.UNKNOWN, e.code || 400)
      }
    },
    deleteQuotation: async (_, { id }, { user }) => {
      try {
        let getQuotation = await models.Quotations.find({ _id: { $in: id, $ne: user?._id } }).lean()

        let result = await models.Quotations.updateMany(
          { _id: { $in: id }, createdBy: new ObjectId(user.company) },
          { $set: { isDeleted: true } }
        ).exec()
        let deletedCount = result.matchedCount
        const deletedList = []
        getQuotation?.map(prd => {
          deletedList.push({
            _id: prd?._id,
            relatedToText: `${prd?.name}`,
            message: ActivityHelpers.message({
              relatedToText: `${prd?.name}`,
              messageType: ActivityHelpers.messageTypes.PRODUCTS_DELETE
            })
          })
        })

        return {
          deletedCount,
          deletedList,
          rejectedList: [],
          rejectedMessage: ''
        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    },
    updateQuotation: async (_, { id, data }, { user }) => {
      try {
        data.name = capitalizeFirstLetter(data?.name) || ''
        const isQuotationExist = await models.Quotations.findOne({ _id: id, createdBy: user.company, isDeleted: false })
        console.log(isQuotationExist)
        if (!isQuotationExist) {
          throw new CustomError(PRODUCT_ERROR.PRODUCT_NOT_FOUND, 400)
        }

        // if (isProductExist.name !== data.name) {
        //     const productwithSameName = await models.Product.findOne({
        //         _id: { $ne: isProductExist._id },
        //         name: data.name,
        //         company: user.company,
        //         isDeleted: false
        //     }).lean().exec()

        //     if (productwithSameName) {
        //         throw new CustomError(PRODUCT_ERROR.PRODUCT_EXIST, 400)
        //     }
        // }

        await models.Quotations.updateOne(
          { _id: isQuotationExist._id },
          {
            $set: {
              name: data.name,
              customerName: data.customerName,
              address: data.address,
              invoiceNumber: data.invoiceNumber,
              date: data.date,
              paymentStatus: data.paymentStatus,
              totalAmount: data.totalAmount,
              billingAddress: data.billingAddress,
              shippingAddress: data.shippingAddress,
              products: data.products,
              hotTableData: data.hotTableData,
              paymentMethod: data.paymentMethod,
              paymentAmounts: data.paymentAmounts,
              notes: data.notes,
              extraFields: data.extraFields,
              extraTotalFields: data.extraTotalFields
            }
          }
        )
        const returnData = await models.Quotations.findOne({ _id: isQuotationExist._id }).lean().exec()

        return returnData
      } catch (e) {
        console.log(e, 'error')
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }

  // Materials: {
  //   isTypeOf: obj => obj instanceof Materials
  // },
  // Part: {
  //   isTypeOf: obj => obj instanceof Part
  // }
}
