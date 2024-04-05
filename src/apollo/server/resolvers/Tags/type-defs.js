import { gql } from "apollo-server-micro";

export const tagGQLSchema = gql`

type Tags {
    _id: String
    name: String
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
}

type tagData{
    count: Int
    data: [Tags]
  }

input TagInput{
    name:String
}

type Query {
    getAllTags( input: searchInput ) : tagData
    getAllTagWithoutPagination ( limit: Int , filter: String ,search: String) : tagData
}

type Mutation {
    createTags( name: String! , logInput: logInput): Tags
    deleteTags(id: [ID!] , logInput: logInput): deleteRes
    updateTags(id:ID! , name:String , logInput: logInput):Tags
}

`