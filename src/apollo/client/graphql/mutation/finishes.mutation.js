import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const ADD_FINISHES = gql`
  mutation createFinishes($data: FinishesInput, $logInput: logInput) {
    createFinishes(data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      unit
      images
      description
      thumb
      status
      visibilityStatus
      unitOfPrice {
        _id
        name
      }
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
        categoryId
      }
      tags
      grade {
        _id
        grade
      }
      attributes {
        _id
        attrRef
        name
        type
        value
      }
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

export const DELETE_FINISHES = gql`
    mutation deleteFinishes($id:[ID!] , $logInput: logInput){
        deleteFinishes(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const UPDATE_FINISHES = gql`
  mutation updateFinishes($id: ID!, $data: FinishesInput, $logInput: logInput) {
    updateFinishes(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      unit
      images
      description
      thumb
      status
      visibilityStatus
      unitOfPrice {
        _id
        name
      }
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
        categoryId
      }
      tags
      grade {
        _id
        grade
      }
      attributes {
        _id
        attrRef
        name
        type
        value
      }
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

export const UPDATE_FINISHES_SETTING = gql`
  mutation updateFinishesettings($id: ID!, $data: FinishesettingsInput, $logInput: logInput) {
    updateFinishesettings(id: $id, data: $data, logInput: $logInput) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      unit
      images
      description
      thumb
      status
      visibilityStatus
      parentCategory {
        _id
        categoryName
      }
      category {
        _id
        categoryName
        categoryId
      }
      tags
      grade {
        _id
        grade
      }
      attributes {
        _id
        attrRef
        name
        type
        value
      }
      createdBy {
        _id
        email
        firstName
        lastName
      }
      createdAt
      settings {
        shine
        glass
        glossiness
        repeatX
        repeatY
        offsetX
        offsetY
        rotate
        image
        roughnessHexColor
        metalnessHexColor
        imageWidth
        imageHeight
        cropperData {
          x
          y
          width
          height
          rotate
          scaleX
          scaleY
        }
        width
        verticalSize
        horizontalSize
        finishSize
        roughnessFactor
      }
    }
  }
`
