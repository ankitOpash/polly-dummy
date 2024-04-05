import { gql } from '@apollo/client';
import { DELETE_RES } from '../GQLModels';

export const ADD_COMPANY_CATEGORY = gql`
mutation addCompanyCategory($input: [companyCategoryInput] $logInput: logInput) {
  addCompanyCategory(input: $input logInput: $logInput) {
    _id
    category{
        categoryId
      	categoryName
      }
      parentCategory{
        parentCategoryId
        categoryName
      }
      catalogType
    createdAt
    updatedAt
  }
}
`

export const UPDATE_COMPANY_CATEGORY = gql`
mutation updateCompanyCategory($input: companyCategoryUpdateInput $logInput: logInput) {
  updateCompanyCategory(input: $input logInput: $logInput) {
    _id
    category{
        categoryId
      	categoryName
      }
      parentCategory{
        parentCategoryId
        categoryName
      }
    catalogType
    createdAt
    updatedAt
  }
}
`

export const DELETE_COMPANY_CATEGORIES = gql`
  mutation deleteCompanyCategory($input: DeleteInput $logInput: logInput) {
    deleteCompanyCategory(input: $input logInput: $logInput) ${DELETE_RES}
  }
`