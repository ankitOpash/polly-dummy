export const companyCategoryGQLSchema = `

type Category{
  categoryId: ID
  categoryName: String
}

type ParentCategory{
  parentCategoryId: ID
  categoryName: String
}

type CompanyCategory{
  _id: ID
  category:Category
  parentCategory:ParentCategory
  catalogType:String
  createdByUserName: String
  createdAt: String
  updatedAt: String
}
type paginateCompanyCategory{
  count: Int
  data:[CompanyCategory]
}
input CategoryInput {
  categoryId: ID
  categoryName: String
}
input ParentCategoryInput {
  parentCategoryId: ID
  categoryName: String
}
input companyCategoryInput {
  category: CategoryInput
  parentCategory: ParentCategoryInput
  catalogType:String
}
input companyCategoryUpdateInput {
  _id: ID
  category: String
}

type companyCategoryCreated{
  _id: ID
  category:Category
  parentCategory:ParentCategory
  catalogType: String
  createdAt: String
  updatedAt: String
}
input DeleteInput{
  ids : [String]
}

type subCategoryGroup {
  categoryId: ID
  categoryName: String
}

type companyCategoryGroupData {
  count: Int
  data:[companyCategoryGroup]
}

type companyCategoryGroup {
  _id: ID
  parentCategoryName: String
  categories: [subCategoryGroup]
}

type Query {
  getCompanyCategory(input:searchInput):paginateCompanyCategory
  getCompanyCategoryInGroup(catalogType: String ): companyCategoryGroupData
}

type Mutation {
  addCompanyCategory(input:[companyCategoryInput] logInput: logInput):companyCategoryCreated
  updateCompanyCategory(input:companyCategoryUpdateInput logInput: logInput):companyCategoryCreated
  deleteCompanyCategory(input: DeleteInput logInput: logInput):deleteRes
}

`