const Tables = {
  companiesTbl: ['name', 'email', 'status', 'type', 'uniqueCode', 'createdByUserName'],
  userTbl: ['firstName', 'lastName', 'email', 'status', 'createdByUserName', 'roleName'],
  RoleTbl: ['name', 'firstName', 'lastName', 'createdByUserName'],
  TagsTbl: ['name', 'email', 'firstName', 'lastName', 'createdByUserName'],
  categoryTbl: ['categoryName', 'parentCategory.categoryName', 'createdByUserName', 'catalogType'],
  activityTbl: ['message', 'action', 'actionOn', 'createdByUserName'],
  companyCategoryTbl: ['category.categoryName', 'parentCategory.categoryName', 'createdByUserName', 'catalogType'],
  adminProductAttributeTbl: [
    'group.name',
    'catalogType',
    'name',
    'type',
    'parentCategory.categoryName',
    'category.categoryName',
    'createdByUserName'
  ],
  productAttributeTbl: [
    'group.name',
    'catalogType',
    'name',
    'type',
    'parentCategory.categoryName',
    'category.categoryName',
    'createdByUserName'
  ],
  customerTbl: ['firstName', 'lastName', 'email', 'type', 'createdByUserName'],
  Product: [
    'name',
    'createdByUserName',
    'sku',
    'price',
    'uniqueCode',
    'parentCategory.categoryName',
    'category.categoryName'
  ],
  PartTbl: [
    'name',
    'createdByUserName',
    'sku',
    'price',
    'uniqueCode',
    'parentCategory.categoryName',
    'category.categoryName'
  ],
  searchTagsTbl: ['name'],
  searchRolesTbl: ['name'],
  searchGradesTbl: ['grade'],
  searchCategoriesTbl: ['categoryName'],
  searchCompanyCategoriesTbl: ['categoryName'],
  GradeTbl: ['grade', 'firstName', 'lastName', 'createdByUserName'],
  configuratorTbl: ['name', 'type'],
  configuratorGroupTbl: ['name'],
  searchCatelogTbl: ['name', 'sku', 'grade'],
  MaterialTbl: [
    'name',
    'sku',
    'price',
    'uniqueCode',
    'parentCategory.categoryName',
    'category.categoryName',
    'firstName',
    'lastName',
    'createdByUserName'
  ],
  FinishesTbl: [
    'name',
    'sku',
    'price',
    'uniqueCode',
    'parentCategory.categoryName',
    'category.categoryName',
    'firstName',
    'lastName',
    'createdByUserName'
  ],
  QuotationTbl: [
    'name',
    'date',
    'total',
    'customerName.firstName',
    'customerName.lastName',
    'paymentAmounts.totalAmount'
  ]
}

let _GeneralHelpers = function () {
  this.getNewMongoDB_ObjectId = () => {
    let ObjectId = require('mongoose').Types.ObjectId

    return new ObjectId()
  }

  this.paginateOption = (input = {}, populateQueries = []) => {
    const { page = 1, limit = 10, sort } = input

    return {
      page,
      limit,
      sort: sort?.key ? { [sort?.key]: sort?.type } : { createdAt: -1 },
      lean: true,
      leanWithId: true,
      collation: { locale: 'en' },
      ...(populateQueries?.length && {
        populate: populateQueries
      })
    }
  }

  this.filterSearchQuery = (filterString, tableKey) => {
    if (filterString && filterString?.length > 0) {
      const keys = Tables[tableKey]
      const syntax = []
      keys.forEach(ele => {
        syntax.push({ [ele]: { $regex: filterString, $options: 'i' } })
      })

      return { $and: [{ isDeleted: false }, { $or: syntax }] }
    } else {
      return { isDeleted: false }
    }
  }

  this.aggregatePaginate = (populateQueries, filter, sort, rest) => {
    const { page = 1, limit = 10 } = rest

    let pageNumber = page || 1
    let size = limit || 10

    let paginateOption = [
      ...populateQueries,
      {
        $match: filter
      },
      {
        $sort: sort
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: (pageNumber - 1) * size }, { $limit: size }]
        }
      }
    ]

    return paginateOption
  }
}

export const GeneralHelpers = new _GeneralHelpers()
