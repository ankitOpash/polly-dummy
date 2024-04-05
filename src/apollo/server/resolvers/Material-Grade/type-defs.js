import { gql } from "apollo-server-micro";

export const GradeGQLSchema = gql`

type MaterialGrade {
    _id: String
    grade: String
    materials: [Materials]
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
}

type materialData{
    count: Int
    data: [MaterialGrade]
  }


type Query {
    getAllGrade( input: searchInput ) : materialData
    getAllGradeWithoutPagination (search: String) : [MaterialGrade]
}

type Mutation {
    createGrade(grade: String! , logInput: logInput): MaterialGrade
    deleteGrade(id: [ID!] , logInput: logInput): deleteRes
    updateGrade(id:ID! , grade:String , logInput: logInput):MaterialGrade
}

`