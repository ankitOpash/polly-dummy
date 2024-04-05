import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateQuotation = gql`
  mutation createQuotation($data: QuotationInput, $logInput: logInput) {
    createQuotation(data: $data, logInput: $logInput) {
      _id
      name
    }
  }
`

export const DeleteQuotation = gql`
    mutation deleteQuotation($id:[ID!] , $logInput: logInput){
        deleteQuotation(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const UpdateQuotation = gql`
  mutation updateQuotation($id: ID!, $data: QuotationInput, $logInput: logInput) {
    updateQuotation(id: $id, data: $data, logInput: $logInput) {
      _id
      name
    }
  }
`
