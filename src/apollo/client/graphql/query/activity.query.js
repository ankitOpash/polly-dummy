import { gql } from '@apollo/client';

export const GET_ACTIVITY = gql`
 query GetActivities($input: searchInput) {
  getActivities(input: $input) {
    count
    data {
      action
      actionOn
      message
      createdAt
      createdByUserName
    }
  }
}
`