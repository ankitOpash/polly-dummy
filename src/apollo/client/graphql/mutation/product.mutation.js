import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const ADD_PRODUCT = gql`
  mutation createProduct($data: ProductInput, $logInput: logInput) {
    createProduct(data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      images
      description
      thumb
      visibilityStatus
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
      }
      tags
      createdBy {
        _id
        email
        firstName
        lastName
      }
      priceTemplates {
        name
        fields {
          name
          value
          visible
          key
          evaluatedValue
        }
      }
      attributeGroups {
        name
        attributes {
          name
          value
          visible
        }
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id:[ID!] , $logInput: logInput){
        deleteProduct(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $data: ProductInput, $logInput: logInput) {
    updateProduct(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      images
      description
      thumb
      visibilityStatus
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
      }
      tags
      createdBy {
        _id
        email
        firstName
        lastName
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRODUCT_SETTINGS = gql`
  mutation updateProductSettings($id: ID!, $data: ProductSettingsInput, $logInput: logInput) {
    updateProductSettings(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      images
      description
      thumb
      visibilityStatus
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
      }
      tags
      settings {
        groups {
          components
          materialCategory {
            _id
            category {
              categoryName
            }
          }
          name
          _id
        }
        image
        objUrl
        gltfUrl
        fbxUrl
      }
      createdBy {
        _id
        email
        firstName
        lastName
      }
      createdAt
      updatedAt
    }
  }
`
