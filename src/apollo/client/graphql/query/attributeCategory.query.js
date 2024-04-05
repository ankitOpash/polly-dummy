import { gql } from '@apollo/client'

export const GetAllAttributeCategories = gql`
  query getAllAttributeCategories($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllAttributeCategories(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }
    ) {
      count
      data {
        _id
        name
        attributeCategoryGroups {
          _id
          name
          attributes {
            _id
            name
            value
            unit {
              _id
              name
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

export const GetAttributeCategoryById = gql`
  query getAttributeCategoryById($id: ID!) {
    getAttributeCategoryById(id: $id) {
      _id
      name
      attributeCategoryGroups {
        _id
        name
        attributes {
          _id
          name
          value
          unit {
            _id
            name
          }
          type {
            value
            label
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

export const GetAllAttributeCategoriesWithOnlyAttributes = gql`
  query getAllAttributeCategories($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllAttributeCategories(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }
    ) {
      count
      data {
        attributeCategoryGroups {
          _id
          attributes {
            _id
            name
            value
          }
        }
      }
    }
  }
`

// export const GetPriceTemplateById = gql`
//   query getPriceTemplateById($id: ID!) {
//     getPriceTemplateById(id: $id) {
//       _id
//       name
//       fields {
//         name
//         visible
//         value
//         key
//         evaluatedValue
//         fieldId
//         isCostTemplateField
//         costTemplate {
//           _id
//           name
//         }
//       }
//       createdBy {
//         _id
//         name
//       }
//     }
//   }
