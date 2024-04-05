import { gql } from 'apollo-server-micro'

export const configuratorGroupGQLSchema = gql`
  type ConditionOptionRes {
    _id: ID
    name: String
    image: String
    action: String
    description: String
    changePrice: Boolean
    priceDependentUpon: String
  }

  type OptionRes {
    optionName: String
    description: String
    type: String
    materialType: String
    materials: [Materials]
    parts: [Part]
    materialGroups: [MaterialGrade]
    conditionOptions: [ConditionOptionRes]
  }

  type UpsertOptionRes {
    optionName: String
    description: String
    type: String
    materialType: String
    materials: [ID]
    parts: [ID]
    materialGroups: [ID]
    conditionOptions: [ConditionOptionRes]
  }

  type ConfiguratorGroup {
    _id: String
    name: String
    uniqueCode: String
    configurator: Configurator
    isRequired: Boolean
    options: [OptionRes]
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type UpsertConfiguratorGroup {
    _id: String
    name: String
    uniqueCode: String
    configurator: ID
    isRequired: Boolean
    options: [UpsertOptionRes]
    company: ID
    createdBy: ID
    createdAt: String
    updatedAt: String
  }

  type paginateConfiguratorGroup {
    count: Int
    data: [ConfiguratorGroup]
  }

  input ConditionOptionInput {
    name: String
    image: String
    action: String
    description: String
    changePrice: Boolean
    priceDependentUpon: String
  }

  input OptionInput {
    optionName: String
    description: String
    type: String
    materialType: String
    materials: [ID]
    parts: [ID]
    materialGroups: [ID]
    conditionOptions: [ConditionOptionInput]
  }

  input ConfiguratorGroupInput {
    name: String
    configurator: ID
    isRequired: Boolean
    options: [OptionInput]
  }

  type Query {
    getAllConfiguratorGroups(id: ID, input: searchInput): [ConfiguratorGroup]
    getConfiguratorGroup(id: ID): ConfiguratorGroup
  }

  type Mutation {
    createConfiguratorGroup(input: ConfiguratorGroupInput, logInput: logInput): UpsertConfiguratorGroup
    updateConfiguratorGroup(id: ID!, input: ConfiguratorGroupInput, logInput: logInput): UpsertConfiguratorGroup
    deleteConfiguratorGroups(ids: [ID!], logInput: logInput): deleteRes
  }
`
