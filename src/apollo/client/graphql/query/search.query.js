import { gql } from "@apollo/client";

export const SEARCH_TAGS = gql`
query searchTags(
  $input: searchInput
    ){
      searchTags(input: $input){
       _id
       name
    }
}
`

export const SEARCH_ROLES = gql`
  query searchRoles(
    $input: searchInput
      ){
        searchRoles(input: $input){
        _id
        name
      }
  }
`

export const SEARCH_GRADE = gql`
  query searchGrade(
    $input: searchInput
      ){
        searchGrade(input: $input){
        _id
        grade
      }
  }
`

export const SEARCH_ALL_ADMIN_CATEGORIES = gql`
 query searchAllAdminCategories(
    $input: searchInput
    $catalogType: String
      ){
        searchAllAdminCategories(input: $input , catalogType: $catalogType){
        _id
        categoryName
        totalSubCategories
      }
  }
`

export const SEARCH_ALL_COMPANY_CATEGORIES = gql`
  query searchCompanyCategories(
    $input: searchInput
    $catalogType: String
      ){
        searchCompanyCategories(input: $input catalogType: $catalogType){
        _id
        categoryId
        categoryName
      }
  }
 
`

export const SEARCH_ADMIN_PARENT_CATEGORIES = gql`
 query searchAdminParentCategories(
    $input: searchInput
    $catalogType: String
      ){
        searchAdminParentCategories(input: $input , catalogType: $catalogType){
        _id
        categoryName
        totalSubCategories
      }
  }
`

export const SEARCH_ADMIN_SUB_CATEGORIES = gql`
 query searchAdminSubCategories(
    $input: searchInput
  	$parentCategoryIds : [ID]
      ){
        searchAdminSubCategories(input: $input parentCategoryIds:$parentCategoryIds){
        _id
        categoryName
        totalSubCategories
        parentCategory{
          _id
          categoryName
        }
      }
  }
`


export const SEARCH_COMPANY_PARENT_CATEGORIES = gql`
  query searchCompanyParentCategories(
    $input: searchInput
    $catalogType: String
      ){
        searchCompanyParentCategories(input: $input catalogType: $catalogType){
        _id
        parentCategoryId
        categoryName
      }
  }
 
`

export const SEARCH_COMPANY_SUB_CATEGORIES = gql`
  query searchCompanySubCategories(
    $input: searchInput
    $parentCategoryId : ID
    $catalogType: String
      ){
        searchCompanySubCategories(input: $input parentCategoryId:$parentCategoryId catalogType: $catalogType){
        _id
        categoryId
        categoryName
      }
  }
 
`

export const SEARCH_COMPANY_SUB_CATEGORIES_FOR_FILTER = gql`
  query searchCompanySubCategoriesForFilter(
    $input: searchInput
    $parentCategoryIds : [ID]
    $catalogType: String
      ){
        searchCompanySubCategoriesForFilter(input: $input parentCategoryIds:$parentCategoryIds catalogType: $catalogType){
        _id
        categoryId
        categoryName
        parentCategory{
          _id
          categoryName
        }
      }
  }
 
`

export const SEARCH_ADMIN_PRODUCT_ATTRIBUTES = gql`
   query searchAdminAttributes(
    $input: searchInput
    $catalogType: String
    ){
      searchAdminAttributes(
        input: $input catalogType: $catalogType
      ) {
     
        _id
        name
        group {
          _id,
          name
        }
        type
        catalogType
        options
        placeHolder
        parentCategory {
          _id
          categoryName
        }
        category {
          _id
          categoryName
        }
        isRequired
        createdBy {
          _id
          email
          firstName
          lastName
        }
        createdAt
        updatedAt
      
    }
   }
`

export const SEARCH_CREATED_BY = gql`
  query searchCreatedBy(
    $input: searchInput
      ){
        searchCreatedBy(input: $input){
          _id
          firstName
          lastName
      }
  }
 
`