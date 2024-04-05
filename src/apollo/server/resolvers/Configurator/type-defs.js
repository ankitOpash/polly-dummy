import { gql } from 'apollo-server-micro'

export const configuratorGQLSchema = gql`
  type Configurator {
    _id: String
    name: String
    uniqueCode: String
    type: String
    image: String
    products: [Product]
    company: ID
    createdByUserName: String
    createdAt: String
    updatedAt: String
    isSingleProductConfigurator: Boolean
  }

  type paginateConfigurator {
    count: Int
    data: [Configurator]
  }

  input ConfiguratorInput {
    name: String
    type: String
    image: String
    products: [ID]
    isSingleProductConfigurator: Boolean
  }

  type Query {
    getAllConfigurators(input: searchInput): paginateConfigurator
    getConfigurator(id: ID): Configurator
  }

  type Mutation {
    createConfigurator(input: ConfiguratorInput, logInput: logInput): Configurator
    updateConfigurator(id: ID!, input: ConfiguratorInput, logInput: logInput): Configurator
    deleteConfigurators(ids: [ID!], logInput: logInput): deleteRes
  }
`
