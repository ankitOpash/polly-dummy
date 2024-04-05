import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query GetCustomer($input: searchInput) {
    getCustomer(input: $input) {
      count
      data {
        _id
        firstName
        lastName
        email
        type
        company
        verified
        status
        createdByUserName
        createdAt
        updatedAt
      }
    }
  }
`