import { gql } from '@apollo/client'

export const GetAllCostTemplates = gql`
  query getAllCostTemplates($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllCostTemplates(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }
    ) {
      count
      data {
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
        createdBy {
          _id
          name
        }
      }
    }
  }
`

export const GetCostTemplateById = gql`
  query getCostTemplateById($id: ID!) {
    getCostTemplateById(id: $id) {
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
          _id
          category {
            categoryId
            categoryName
          }
        }
        fieldId
      }
      createdBy {
        _id
        name
      }
    }
  }
`
