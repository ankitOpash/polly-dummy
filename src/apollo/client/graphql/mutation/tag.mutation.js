import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_TAG = gql`
    mutation createTags($name: String! , $logInput: logInput){
        createTags(name:$name , logInput: $logInput){
            _id
            name
            company
            createdBy {
                _id
                email
                firstName
                lastName
              }
            createdAt
    }
}
`

export const DELETE_TAG = gql`
    mutation deleteTags($id:[ID!] , $logInput: logInput){
        deleteTags(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const EDIT_TAG = gql`
mutation updateTags($id:ID! , $name:String , $logInput: logInput){
    updateTags(id:$id , name:$name , logInput: $logInput){
        _id
        name
        company
        createdBy {
            _id
            email
            firstName
            lastName
          }
        createdAt
    }
} 
`