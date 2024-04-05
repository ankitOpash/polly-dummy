import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";


export const ADD_PART = gql`
mutation createPart($data: PartInput!, $logInput: logInput!) {
  createPart(data: $data, logInput: $logInput) {
    _id
    name
  }
}
`

export const UPDATE_PART = gql`
  mutation updatePart($id: ID!, $data: PartInput, $logInput: logInput) {
  updatePart(id: $id, data: $data, logInput: $logInput) {
    _id
    name
  }
}
`

export const DELETE_PART = gql`
mutation deletePart($id:[ID!] , $logInput: logInput){
  deletePart(id:$id , logInput: $logInput) ${DELETE_RES}
}
`