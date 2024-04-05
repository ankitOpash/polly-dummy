import { gql } from 'apollo-server-micro'

const searchGQLSchema = gql`

type commonNode {
  _id: ID
  name: String
}
type GradeNode {
  _id: ID
  grade: String
}
type categoriesNode {
  _id: ID
  categoryName: String
  totalSubCategories:Number
}
type CategoryName{
  _id: ID
  categoryName:String
}
type subCategoriesNode {
  _id: ID
  categoryName: String
  parentCategory:CategoryName
  totalSubCategories:Number
}

type companyParentCategoriesNode {
  _id: ID
  parentCategoryId: ID
  categoryName: String
}

type companySubCategoriesNode {
  _id: ID
  categoryId: ID
  categoryName: String
}
type companySubCategoriesForFilterNode{
  _id: ID
  categoryId: ID
  categoryName: String
  parentCategory:companyParentCategoriesNode
}

type CatelogNode {
  _id: ID
  name: String
  thumb: String
  sku: String
  grade: String
}

type commmonUser{
  firstName: String
  lastName: String
  _id: String
}

type Query {
    searchTags( input: searchInput ) : [commonNode]
    searchRoles( input: searchInput ) : [commonNode]
    searchGrade( input: searchInput ) : [GradeNode]
    searchAllAdminCategories( input: searchInput catalogType: String) : [categoriesNode]
    searchCompanyCategories( input: searchInput catalogType: String) : [companySubCategoriesNode]
    searchAdminParentCategories( input: searchInput , catalogType: String) : [categoriesNode]
    searchAdminSubCategories( input: searchInput  parentCategoryIds : [ID]) : [subCategoriesNode]
    searchCompanyParentCategories( input: searchInput catalogType: String) : [companyParentCategoriesNode]
    searchCompanySubCategories( input: searchInput  parentCategoryId : ID catalogType: String) : [companySubCategoriesNode]
    searchCompanySubCategoriesForFilter( input: searchInput  parentCategoryIds : [ID] catalogType: String) : [companySubCategoriesForFilterNode]
    searchAdminAttributes( input: searchInput catalogType: String) : [AdminProductAttribute]
    searchProducts( input: searchInput ) : [CatelogNode]
    searchMaterials( input: searchInput ) : [CatelogNode]
    searchParts( input: searchInput ) : [CatelogNode]
    searchCreatedBy( input: searchInput ) : [commmonUser]
}

`

export { searchGQLSchema }