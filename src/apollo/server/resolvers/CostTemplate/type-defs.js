import { gql } from 'apollo-server-micro'

export const CostTemplateGQLSchema = gql`
  enum DependencyOperators {
    Rate
    Percentage
  }

  enum DependentUpon {
    None
    Material
    Part
  }

  type CostField {
    name: String
    value: String
    unit: Unit
    status: String
    description: String
    dependencyOperator: DependencyOperators
    attribute: Attribute
    dependentUpon: DependentUpon
    dependentUponCategory: CompanyCategory
    fieldId: String
  }

  input CostFieldInput {
    name: String
    value: String
    unit: ID
    status: String
    description: String
    dependencyOperator: DependencyOperators
    attribute: ID
    dependentUpon: DependentUpon
    dependentUponCategory: ID
    fieldId: String
  }

  type CostTemplate {
    _id: ID
    name: String
    fields: [CostField]
    createdBy: Company
  }

  input CostTemplateInput {
    name: String!
    fields: [CostFieldInput]
  }

  type CostTemplateData {
    count: Int
    data: [CostTemplate]
  }

  type Query {
    getAllCostTemplates(input: searchInput): CostTemplateData
    getCostTemplateById(id: ID!): CostTemplate
  }

  type Mutation {
    createCostTemplate(data: CostTemplateInput!, logInput: logInput): CostTemplate
    updateCostTemplate(id: ID!, data: CostTemplateInput, logInput: logInput): CostTemplate
    deleteCostTemplate(id: [ID!], logInput: logInput): deleteRes
  }
`
