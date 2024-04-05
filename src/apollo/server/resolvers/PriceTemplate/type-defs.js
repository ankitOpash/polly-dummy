import { gql } from 'apollo-server-micro'

export const PriceTemplateGQLSchema = gql`
  type Field {
    _id: ID
    name: String
    value: String
    visible: Boolean
    key: String
    evaluatedValue: String
    isCostTemplateField: Boolean
    costTemplate: CostTemplate
    fieldId: String
  }

  input FieldInput {
    name: String
    value: String
    visible: Boolean
    key: String!
    evaluatedValue: String
    isCostTemplateField: Boolean
    costTemplateId: ID
    fieldId: String
  }

  type PriceTemplate {
    _id: ID
    name: String
    total: Float
    fields: [Field]
    createdBy: Company
  }

  input PriceTemplateInput {
    name: String!
    total: Float
    fields: [FieldInput]
  }

  type PriceTemplateData {
    count: Int
    data: [PriceTemplate]
  }

  type Query {
    getAllPriceTemplates(input: searchInput): PriceTemplateData
    getPriceTemplateById(id: ID!): PriceTemplate
  }

  type Mutation {
    createPriceTemplate(data: PriceTemplateInput!, logInput: logInput): PriceTemplate
    updatePriceTemplate(id: ID!, data: PriceTemplateInput, logInput: logInput): PriceTemplate
    deletePriceTemplate(id: [ID!], logInput: logInput): deleteRes
  }
`
