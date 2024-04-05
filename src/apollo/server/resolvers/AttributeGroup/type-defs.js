import { gql } from 'apollo-server-micro'

export const attributeGroupGQLSchema = gql`

type AttributeGroup {
  _id: ID
  id: String
  name: String!
  createdBy: User
  createdAt: String
}

input AttributeGroupInput {
  _id: ID
  name: String
}

type Query {
  getAttributeGroups: [AttributeGroup]
}

type CreatedAttributeGroupResponse {
  successMsg: String
  rejectedMsg: String
}

type Mutation {
  createAttributeGroup(input: [AttributeGroupInput]): CreatedAttributeGroupResponse
}
`