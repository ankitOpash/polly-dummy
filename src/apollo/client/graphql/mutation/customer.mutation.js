import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_CUSTOMER = gql`
  mutation AddCustomer($input: CustomerInput $logInput: logInput) {
    addCustomer(input: $input logInput: $logInput) {
      _id
      firstName
      lastName
      email
      type
      company
      status
      verified
      createdByUserName
    }
  }
`

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput $logInput: logInput) {
    updateCustomer(input: $input logInput: $logInput) {
      _id
      firstName
      lastName
      email
      type
      company
      verified
      status
      createdByUserName
    }
  }
`

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($input: DeleteInput $logInput: logInput) {
    deleteCustomer(input: $input logInput: $logInput) ${DELETE_RES}
  }
`

export const UPDATE_CUSTOMER_STATUS = gql`
mutation updateCustomerStatus(
  $status: String!
  $id: ID!
  $logInput: logInput
  ) {
     updateCustomerStatus(
        status: $status
        id: $id
        logInput: $logInput
     )
}
`

export const RESET_CUSTOMER_PASS = gql`
    mutation resetCustomerPassword($password: String! $userId: String){
      resetCustomerPassword( password: $password  userId:$userId)
   }
`