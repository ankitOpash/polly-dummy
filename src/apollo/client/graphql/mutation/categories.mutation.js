import { gql } from '@apollo/client';
import { DELETE_RES } from '../GQLModels';

export const ADD_CATEGORY = gql`
  mutation AddCategory($input: categoryInput $logInput: logInput) {
    addCategory(input: $input logInput: $logInput) {
      CategoryIsAlreadyExist
    }
  }
`

export const UPDATE_CATEGORIES = gql`
  mutation updateCategory($input: categoryUpdateInput $logInput: logInput) {
    updateCategory(input: $input logInput: $logInput) {
      _id
      categoryName
      isSubCategory
      parentCategory
    }
  }
`

export const DELETE_CATEGORIES = gql`
  mutation deleteCategory($input: DeleteInput $logInput: logInput) {
    deleteCategory(input: $input logInput: $logInput) ${DELETE_RES}
  }
`