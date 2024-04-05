import { gql } from '@apollo/client';
import { DELETE_RES } from "../GQLModels";

export const CREATE_ADMIN_PRODUCT_ATTRIBUTE = gql`
   mutation createAdminProductAttribute(
      $input: AdminProductAttributeInput!
      $logInput: logInput
      ) {
        createAdminProductAttribute(
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

export const UPDATE_ADMIN_PRODUCT_ATTRIBUTE = gql`
   mutation updateAdminProductAttribute(
      $input: AdminProductAttributeInput!
      $logInput: logInput
      ) {
         updateAdminProductAttribute(
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

export const DELETE_ADMIN_PRODUCT_ATTRIBUTES = gql`
   mutation deleteAdminProductAttributes($ids: [ID!]! $logInput: logInput){
      deleteAdminProductAttributes(ids: $ids logInput: $logInput) ${DELETE_RES}
   }
`