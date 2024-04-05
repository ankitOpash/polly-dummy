import { gql } from '@apollo/client';

export const GET_ADMIN_PRODUCT_ATTRIBUTES = gql`
   query getAdminProductAttributes(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    $filter: String
    ){
      getAdminProductAttributes(input: {
      search: $search
      page: $page
      limit: $limit
      sort: $sort
      filter: $filter
    }) {
      count
      data {
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
   }
`