import { gql } from 'apollo-server-micro'

export const UnitsGQLSchema = gql`
  type Unit {
    _id: ID
    name: String
    createdBy: Company
  }

  input UnitInput {
    name: String!
  }

  type UnitsData {
    count: Int
    data: [Unit]
  }

  type Query {
    getAllUnits(input: searchInput): UnitsData
    getUnitById(id: ID!): Unit
  }

  type Mutation {
    createUnit(data: UnitInput!, logInput: logInput): Unit
    updateUnit(id: ID!, data: UnitInput, logInput: logInput): Unit
    deleteUnit(id: [ID!], logInput: logInput): deleteRes
  }
`
