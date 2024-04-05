import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreatePriceTemplate = gql`
  mutation createPriceTemplate($data: PriceTemplateInput!) {
    createPriceTemplate(data: $data) {
      _id
      name
      fields {
        name
        visible
        value
      }
    }
  }
`

export const UpdatePriceTemplate = gql`
  mutation updatePriceTemplate($id: ID!, $data: PriceTemplateInput, $logInput: logInput) {
    updatePriceTemplate(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      fields {
        name
        visible
        value
      }
    }
  }
`

export const DeletePriceTemplate = gql`
   mutation deletePriceTemplate($id: [ID!]! $logInput: logInput){
    deletePriceTemplate(id: $id logInput: $logInput) ${DELETE_RES}
   }
`
