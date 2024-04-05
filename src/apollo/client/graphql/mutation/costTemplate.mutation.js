import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const CreateCostTemplate = gql`
  mutation createCostTemplate($data: CostTemplateInput!) {
    createCostTemplate(data: $data) {
      _id
      name
      fields {
        name
        value
        unit {
          _id
          name
        }
        description
        status
        dependencyOperator
        attribute {
          _id
          name
        }
        dependentUpon
        dependentUponCategory {
          category {
            categoryId
            categoryName
          }
        }
        fieldId
      }
    }
  }
`

export const UpdateCostTemplate = gql`
  mutation updateCostTemplate($id: ID!, $data: CostTemplateInput, $logInput: logInput) {
    updateCostTemplate(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      fields {
        name
        value
        unit {
          _id
          name
        }
        description
        status
        dependencyOperator
        attribute {
          _id
          name
        }
        dependentUpon
        dependentUponCategory {
          category {
            categoryId
            categoryName
          }
        }
        fieldId
      }
    }
  }
`

export const DeleteCostTemplate = gql`
   mutation deleteCostTemplate($id: [ID!]! $logInput: logInput){
    deleteCostTemplate(id: $id logInput: $logInput) ${DELETE_RES}
   }
`
