import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query getCategory($searchInput: searchInput) {
    getCategory(input: $searchInput) {
      count
      data {
        _id
        categoryName
        isSubCategory
        catalogType
        parentCategory{
          _id
          categoryName
        }
        createdAt
        updatedAt
        createdByUserName
        }
    }
  }
`