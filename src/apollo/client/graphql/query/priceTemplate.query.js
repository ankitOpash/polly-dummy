import { gql } from '@apollo/client'

export const GetAllPriceTemplates = gql`
  query getAllPriceTemplates($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllPriceTemplates(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }
    ) {
      count
      data {
        _id
        name
        fields {
          _id
          name
          visible
          value
          key
          evaluatedValue
          fieldId
          isCostTemplateField
          costTemplate {
            _id
            name
            fields {
              name
              value
              unit {
                _id
                name
              }
              dependencyOperator
              attribute {
                _id
                name
                value
              }
              dependentUpon
              dependentUponCategory {
                _id
                category {
                  categoryId
                  categoryName
                }
              }
            }
          }
        }
        createdBy {
          _id
          name
        }
      }
    }
  }
`

export const GetPriceTemplateById = gql`
  query getPriceTemplateById($id: ID!) {
    getPriceTemplateById(id: $id) {
      _id
      name
      fields {
        name
        visible
        value
        key
        evaluatedValue
        fieldId
        isCostTemplateField
        costTemplate {
          _id
          name
          fields {
            name
            value
            unit {
              _id
              name
            }
            dependencyOperator
            attribute {
              _id
              name
              value
            }
            dependentUpon
            dependentUponCategory {
              _id
              category {
                categoryId
                categoryName
              }
            }
          }
        }
      }
      createdBy {
        _id
        name
      }
    }
  }
`
