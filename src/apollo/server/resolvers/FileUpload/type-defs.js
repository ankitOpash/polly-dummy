import { gql } from 'apollo-server-micro'

export const fileUploadGQLSchema = gql`

type signUrlObject {
  url: String
  fileName: String
}

type Mutation {
  generatePreSignURL( fileUploadPath: String! type: String!): signUrlObject
  generateMultiplePreSignURL( fileUploadPath: [String] type: String): [signUrlObject]
}

`;