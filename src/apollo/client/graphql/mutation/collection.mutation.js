import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateCollection = gql`
  mutation createCollection($data: CollectionInput!) {
    createCollection(data: $data) {
      _id
      name
      description
      products {
        _id
        name
      }
    }
  }
`

export const AddProductsToCollection = gql`
  mutation addProductsToCollection($data: CollectionProductsInput!) {
    addProductsToCollection(data: $data) {
      _id
      name
      description
      products {
        _id
        name
      }
    }
  }
`

export const UpdateCollection = gql`
  mutation updateCollection($id: ID!, $data: CollectionInput, $logInput: logInput) {
    updateCollection(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      description
      products {
        _id
        name
      }
    }
  }
`

export const DeleteCollection = gql`
   mutation deleteCollection($id: [ID!]! $logInput: logInput){
    deleteCollection(id: $id logInput: $logInput) ${DELETE_RES}
   }
`
