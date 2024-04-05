import { gql } from '@apollo/client'
import { DELETE_RES } from '../GQLModels'

export const ADD_MATERIAL = gql`
  mutation createMaterial($data: MaterialInput, $logInput: logInput) {
    createMaterial(data: $data, logInput: $logInput) {
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

export const DELETE_MATERIAL = gql`
    mutation deleteMaterials($id:[ID!] , $logInput: logInput){
        deleteMaterials(id:$id , logInput: $logInput) ${DELETE_RES}
    }
`

export const UPDATE_MATERIAL = gql`
  mutation updateMaterials($id: ID!, $data: MaterialInput, $logInput: logInput) {
    updateMaterials(id: $id, data: $data, logInput: $logInput) {
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

export const UPDATE_MATERIAL_SETTING = gql`
  mutation updateMaterialSettings($id: ID!, $data: MaterialSettingsInput, $logInput: logInput) {
    updateMaterialSettings(id: $id, data: $data, logInput: $logInput) {
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
