import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_GRADE = gql`
    mutation createGrade($grade : String! , $logInput: logInput){
        createGrade(grade:$grade , logInput: $logInput){
            _id
            grade
            company
            createdBy {
                _id
                email
                firstName
                lastName
              }
            createdAt
            updatedAt
        }
    }
`

export const DELETE_GRADE = gql`
    mutation deleteGrade($id:[ID!] , $logInput: logInput){
        deleteGrade(id:$id , logInput:$logInput) ${DELETE_RES}
    }
`

export const EDIT_GRADE = gql`
    mutation updateGrade($id:ID! , $grade:String , $logInput: logInput){
        updateGrade(id:$id , grade:$grade , logInput: $logInput){
            _id
            grade
            company
            createdBy {
                _id
                email
                firstName
                lastName
              }
            createdAt
            updatedAt
        }
    }
`