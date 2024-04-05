import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
   query getCompanies(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    ){
    getCompanies(input: {
      search: $search
      page: $page
      limit: $limit
      sort: $sort
    }) {
      count
      data {
        _id
        name
        uniqueCode
        type
        status
        reviewStatus
        createdBy {
          _id
          email
          firstName
          lastName
        }
        user {
          _id
          firstName
          lastName
          phone
          email
        }
        createdAt
        updatedAt
      }
    }
   }
`

export const GET_ALL_COMPANIES = gql`
query getAllCompanies($searchInput: searchInput) {
  getAllCompanies(input: $searchInput) {
    _id
    name
  }
}
`

export const HELLO = gql`
 query hello {
  hello
}
`