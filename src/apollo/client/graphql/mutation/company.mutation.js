import { gql } from '@apollo/client';
import { DELETE_RES } from '../GQLModels';

export const CREATE_COMPANY = gql`
   mutation createCompany(
      $input: companyInput!
      $logInput: logInput
      ) {
        createCompany(
         input: $input
         logInput: $logInput
         ) {
          _id
          id
          name
          uniqueCode
          type
          logo
          status
          phone
          phoneExtension
          email
          notes
          website
          reviewStatus
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

export const UPDATE_COMPANY = gql`
   mutation updateCompany(
      $input: companyInput!
      $logInput: logInput
      ) {
         updateCompany(
         input: $input
         logInput: $logInput
         ) {
          _id
          id
          name
          uniqueCode
          type
          logo
          status
          phone
          phoneExtension
          email
          notes
          website
          reviewStatus
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

export const DELETE_COMPANIES = gql`
   mutation deleteCompanies($ids: [ID!]! $logInput: logInput){
      deleteCompanies(ids: $ids logInput: $logInput)${DELETE_RES}
   }
`

export const UPDATE_COMPANY_STATUS = gql`
   mutation updateCompanyStatus(
      $id: ID! $status: String!
      $logInput: logInput
      ) {
         updateCompanyStatus(
            id: $id status: $status
            logInput: $logInput
         ) {
          _id
          id
          name
          uniqueCode
          type
          logo
          status
          phone
          phoneExtension
          email
          notes
          website
          reviewStatus
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