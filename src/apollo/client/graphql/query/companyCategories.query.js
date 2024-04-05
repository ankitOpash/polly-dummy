import { gql } from '@apollo/client';

export const GET_COMPANY_CATEGORIES = gql`

query GetCompanyCategory($input: searchInput) {
  getCompanyCategory(input: $input) {
    count
    data {
      category{
        categoryId
      	categoryName
      }
      parentCategory{
        parentCategoryId
        categoryName
      }
      catalogType
      _id
      updatedAt
      createdAt
      createdByUserName
    }
  }
}

`


export const GET_COMPANY_CATEGORIES_IN_GROUP = gql`

query getCompanyCategoryInGroup($catalogType: String) {
  getCompanyCategoryInGroup(catalogType: $catalogType) {
    count
    data {
      _id
      parentCategoryName
      categories{
        categoryId
      	categoryName
      }
    }
     
    }
}
`