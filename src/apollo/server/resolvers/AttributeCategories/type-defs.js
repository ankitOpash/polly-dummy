import { gql } from 'apollo-server-micro'

export const AttributeCategoryGQLSchema = gql`
  type AttributeType {
    value: String
    label: String
  }

  input AttributeTypeInput {
    value: String
    label: String
  }

  type AttributeCategoryGroupAttribute {
    _id: ID
    name: String
    value: String
    visible: Boolean
    unit: Unit
    type: AttributeType
    actualAttributeId: ID
  }

  type AttributeCategoryGroup {
    _id: ID
    name: String
    attributes: [AttributeCategoryGroupAttribute]
  }

  type AttributeCategory {
    _id: ID
    name: String
    createdBy: Company
    isDeleted: Boolean
    attributeCategoryGroups: [AttributeCategoryGroup]
  }

  input AttributeCategoryGroupAttributeInput {
    name: String!
    value: String
    visible: Boolean
    unit: ID
    type: AttributeTypeInput
    actualAttributeId: ID # in case of attributes of product
  }

  input AttributeCategoryGroupInput {
    name: String!
    attributes: [AttributeCategoryGroupAttributeInput]
  }

  input AttributeCategoryInput {
    name: String!
    isDeleted: Boolean
    attributeCategoryGroups: [AttributeCategoryGroupInput]
  }

  type AttributeCategoryData {
    count: Int
    data: [AttributeCategory]
  }

  type Query {
    getAllAttributeCategories(input: searchInput): AttributeCategoryData
    getAttributeCategoryById(id: ID!): AttributeCategory
  }

  type Mutation {
    createAttributeCategory(data: AttributeCategoryInput!, logInput: logInput): AttributeCategory
    updateAttributeCategory(id: ID!, data: AttributeCategoryInput, logInput: logInput): AttributeCategory
    deleteAttributeCategory(id: [ID!], logInput: logInput): deleteRes
  }
`
