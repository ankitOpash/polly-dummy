import { gql } from "@apollo/client";

export const GET_TEAMS = gql`
query GetTeams($searchInput: searchInput) {
  getTeams(input: $searchInput) {
    count
    data {
      _id
      firstName
      lastName
      email
      phone
      role{
        _id
        name
      }
      status
      createdAt
      updatedAt
      createdByUserName
    }
  }
}

`