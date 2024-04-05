export const categoryGQLSchema = `
  scalar Number

  type ParentCategory{
      _id: ID
      categoryName: String
  }

  type Category{
    _id: ID
    categoryName:String
    categoryId: ID
    isSubCategory:Boolean
    parentCategory:ParentCategory
    catalogType:String
    createdByUserName: String
    createdAt: String
    updatedAt: String
    totalSubCategories:Number
  }
  type paginateCategory{
    count: Int
    data:[Category]
  }

  input categoryInput {
    categoryName: String
    isSubCategory: Boolean
    parentCategory: ID
    catalogType: String
  }

  input categoryUpdateInput {
    _id:String
    categoryName: String
    catalogType: String
    parentCategory: ID
  }

  type CategoryCreated {
    _id: ID
    categoryName:String
    isSubCategory:Boolean
    parentCategory:String
    catalogType:String
    createdBy: User
    createdAt: String
  }
  type categoryCreatedRes{
    categoryCreated: CategoryCreated
    CategoryIsAlreadyExist: Boolean
  }

  type deletedCatagories {
    count : Int
  }

  input catalogWithoutPaginationInput {
    parentCategoryId : ID
  }

  type Query {
    getCategory(input:searchInput):paginateCategory
  }

  input DeleteInput{
    ids : [String]
  }

  type Mutation {
    addCategory(input:categoryInput logInput: logInput ):categoryCreatedRes
    updateCategory(input:categoryUpdateInput logInput: logInput ):CategoryCreated
    deleteCategory(input:DeleteInput logInput: logInput ):deleteRes
  }
`