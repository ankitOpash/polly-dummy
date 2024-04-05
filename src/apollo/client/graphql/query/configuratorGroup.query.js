import { gql } from '@apollo/client'

export const GET_CONFIGURATOR_GROUPS = gql`
  query getAllConfiguratorGroups($search: String, $id: ID) {
    getAllConfiguratorGroups(id: $id, input: { search: $search }) {
      _id
      name
      isRequired
    }
  }
`

export const GET_CONFIGURATOR_GROUP = gql`
  query getConfiguratorGroup($id: ID) {
    getConfiguratorGroup(id: $id) {
      _id
      name
      uniqueCode
      configurator {
        _id
        name
      }
      options {
        optionName
        description
        type
        materialType
        parts {
          _id
          name
          sku
          thumb
        }
        materials {
          _id
          name
          sku
          thumb
        }
        materialGroups {
          _id
          grade
          materials {
            _id
            name
            sku
            thumb
          }
        }
        conditionOptions {
          _id
          name
          action
          image
          description
          changePrice
          priceDependentUpon
        }
      }
      isRequired
      updatedAt
    }
  }
`
