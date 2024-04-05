import { gql } from 'apollo-server-micro'

export const commonGQLSchema = gql`

  input sortInput {
    key: String
    type: Int
  }

  input searchInput {
    page: Int
    limit: Int
    filter: String
    search: String
    searchField: String
    sort: sortInput
  }

  input logInput {
    action: String
    actionOn: String
    actionIds: [ID]
    oldValue: String
    message: String
  }

  type deletedItem {
    _id: ID
    relatedToText: String
    message: String
  }

  type deleteRes {
    deletedCount: Int
    deletedList: [deletedItem]
    rejectedList: [ID]
    rejectedMessage: String
  }
`