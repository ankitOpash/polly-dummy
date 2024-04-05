import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateUnit = gql`
  mutation createUnit($data: UnitInput!) {
    createUnit(data: $data) {
      _id
      name
    }
  }
`

export const UpdateUnit = gql`
  mutation updateUnit($id: ID!, $data: UnitInput, $logInput: logInput) {
    updateUnit(id: $id, data: $data, logInput: $logInput) {
      _id
      name
    }
  }
`

export const DeleteUnit = gql`
   mutation deleteUnit($id: [ID!]! $logInput: logInput){
    deleteUnit(id: $id logInput: $logInput) ${DELETE_RES}
   }
`
