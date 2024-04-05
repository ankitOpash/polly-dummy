import { gql } from 'apollo-server-micro'

export const adminProductAttributeGQLSchema = gql`

input AdminProductAttributeInput {
  _id: String
  name: String!
  group: ID!
  groupName: String
  type: String!
  catalogType: String!
  options: [String]
  placeHolder: String
  parentCategory: [ID]
  category:[ID]
  isRequired: Boolean
}

type AdminProductAttribute {
  _id: ID
  id: String
  name: String!
  group: AttributeGroup
  groupName: String
  type: String!
  catalogType: String
  options: [String]
  placeHolder: String
  parentCategory: [Category]
  category:[Category]
  isRequired: Boolean
  createdBy: User
  createdAt: String
  updatedAt: String
}

type paginateAdminProductAttributes {
  count: Int
  data: [AdminProductAttribute]
}

type Query {
  getAdminProductAttributes(input: searchInput): paginateAdminProductAttributes
}

type Mutation {
  createAdminProductAttribute(input: AdminProductAttributeInput! logInput: logInput): AdminProductAttribute
  updateAdminProductAttribute(input: AdminProductAttributeInput! logInput: logInput): AdminProductAttribute
  deleteAdminProductAttributes(ids: [ID!]! logInput: logInput): deleteRes
}
`