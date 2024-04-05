import { gql } from 'apollo-server-micro'

export const CollectionGQLSchema = gql`
  type Collection {
    _id: ID
    name: String
    description: String
    products: [Product]
    createdBy: Company
  }

  input CollectionInput {
    name: String!
    description: String
    products: [ID]
  }

  input CollectionProductsInput {
    id: ID!
    products: [ID]!
  }

  type CollectionData {
    count: Int
    data: [Collection]
  }

  type Query {
    getAllCollections(input: searchInput): CollectionData
    getCollectionById(id: ID!): Collection
  }

  type Mutation {
    createCollection(data: CollectionInput!, logInput: logInput): Collection
    addProductsToCollection(data: CollectionProductsInput!, logInput: logInput): Collection
    updateCollection(id: ID!, data: CollectionInput, logInput: logInput): Collection
    deleteCollection(id: [ID!], logInput: logInput): deleteRes
  }
`
