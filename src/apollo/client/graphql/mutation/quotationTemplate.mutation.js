import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateQuotationTemplate = gql`
  mutation createQuotationTemplate($data: QuotationTemplateInput, $logInput: logInput) {
    createQuotationTemplate(data: $data, logInput: $logInput) {
      _id
      name
    }
  }
`

export const DeleteQuotationTemplate = gql`
    mutation deleteQuotationTemplate($id:[ID!] , $logInput: logInput){
        deleteQuotationTemplate(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const UpdateQuotationTemplate = gql`
  mutation updateQuotationTemplate($id: ID!, $data: QuotationTemplateInput, $logInput: logInput) {
    updateQuotationTemplate(id: $id, data: $data, logInput: $logInput) {
      _id
      name
    }
  }
`
