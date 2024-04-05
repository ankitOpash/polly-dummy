import { gql } from 'apollo-server-micro'

export const productAttributeGQLSchema = gql`

input ProductAttributeInput {
  _id: String
  name: String!
  group: ID
  groupName: String
  type: String!
  catalogType: String!
  options: [String]
  adminAttributeRef: ID
  placeHolder: String
  parentCategory: [ID]
  category:[ID]
  isRequired: Boolean
}

type ProductAttribute {
  _id: ID
  id: String
  name: String!
  group: AttributeGroup
  groupName: String
  adminAttributeRef: ID
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

type paginateProductAttributes {
  count: Int
  data: [ProductAttribute]
}

type Query {
  getProductAttributes(input: searchInput): paginateProductAttributes
}

type Mutation {
  createProductAttribute(input: ProductAttributeInput! logInput: logInput): ProductAttribute
  updateProductAttribute(input: ProductAttributeInput! logInput: logInput): ProductAttribute
  deleteProductAttributes(ids: [ID!]! logInput: logInput): deleteRes
}
`