import { gql } from '@apollo/client';
import { DELETE_RES } from '../GQLModels';

export const CREATE_PRODUCT_ATTRIBUTE = gql`
   mutation createProductAttribute(
      $input: ProductAttributeInput!
      $logInput: logInput
      ) {
        createProductAttribute(
         input: $input
         logInput: $logInput
         ) {
          _id
          id
          name
          type
          catalogType
          options
          placeHolder
          isRequired
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

export const UPDATE_PRODUCT_ATTRIBUTE = gql`
   mutation updateProductAttribute(
      $input: ProductAttributeInput!
      $logInput: logInput
      ) {
        updateProductAttribute(
         input: $input
         logInput: $logInput
         ) {
          _id
          id
          name
          type
          catalogType
          options
          placeHolder
          isRequired
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

export const DELETE_PRODUCT_ATTRIBUTES = gql`
   mutation deleteProductAttributes($ids: [ID!]! $logInput: logInput){
    deleteProductAttributes(ids: $ids logInput: $logInput) ${DELETE_RES}
   }
`