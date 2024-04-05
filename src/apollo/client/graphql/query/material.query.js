import { gql } from '@apollo/client'

export const MATERIALS = gql`
  query getAllMaterials($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllMaterials(input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }) {
      count
      data {
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
  }
`

export const GET_MATERIAL_BY_ID = gql`
  query getMaterialDetailById($id: ID!) {
    getMaterialDetailById(id: $id) {
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
      tags {
        _id
        name
      }
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
        diffuse {
          value
          color
          image
        }
        metalness {
          value
          image
        }
        roughness {
          value
          image
        }
        normal {
          value
          image
          flipGreen
          isActive
        }
        opacity {
          value
          image
          blendMode
          isActive
        }
        aspect {
          ratio
          width
          height
          link
        }
        emission {
          value
          image
          isActive
        }
        scale
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

export const SEARCH_MATERIALS = gql`
  query searchMaterials($search: String, $sort: sortInput) {
    searchMaterials(input: { search: $search, sort: $sort }) {
      _id
      name
      sku
      thumb
      grade
    }
  }
`
