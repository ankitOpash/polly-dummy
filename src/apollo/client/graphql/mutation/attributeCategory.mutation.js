import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateAttributeCategory = gql`
  mutation createAttributeCategory($data: AttributeCategoryInput!) {
    createAttributeCategory(data: $data) {
      _id
      name
      attributeCategoryGroups {
        name
        attributes {
          name
          value
        }
      }
      createdBy {
        _id
        name
      }
    }
  }
`

export const UpdateAttributeCategory = gql`
  mutation updateAttributeCategory($id: ID!, $data: AttributeCategoryInput, $logInput: logInput) {
    updateAttributeCategory(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      attributeCategoryGroups {
        name
        attributes {
          name
          value
        }
      }
      createdBy {
        _id
        name
      }
    }
  }
`

export const DeleteAttributeCategory = gql`
   mutation deleteAttributeCategory($id: [ID!]! $logInput: logInput){
    deleteAttributeCategory(id: $id logInput: $logInput) ${DELETE_RES}
   }
`
