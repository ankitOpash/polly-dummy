import { gql } from '@apollo/client'

export const PRODUCT = gql`
  query getAllProduct(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    $filter: String
    $searchField: String
  ) {
    getAllProduct(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, filter: $filter, searchField: $searchField }
    ) {
      count
      data {
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
        attributes {
          _id
          attrRef
          name
          type
          value
        }
        parentCategory {
          _id
          categoryName
        }
        category {
          _id
          categoryName
        }
        priceTemplates {
          _id
          name
          total
          fields {
            name
            value
            visible
            key
            evaluatedValue
            isCostTemplateField
            costTemplate {
              _id
              name
            }
            fieldId
            dependencyOperator
            dependentUpon
            dependentUponCategory {
              _id
              category {
                categoryId
                categoryName
              }
            }
            attribute {
              _id
              name
              value
            }
            # materialOrPart {
            #   ... on Materials {
            #     _id
            #     name
            #     price
            #   }
            #   ... on Part {
            #     _id
            #     name
            #   }
            # }
          }
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
  }
`

export const GET_PRODUCT_BY_ID = gql`
  query getProductDetailById($id: ID!) {
    getProductDetailById(id: $id) {
      _id
      name
      sku
      uniqueCode
      price
      designerNetPrice
      images
      description
      thumb
      status
      visibilityStatus
      attributes {
        _id
        attrRef
        name
        type
        value
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
      thirdCategory {
        _id
        categoryName
        categoryId
      }
      tags {
        _id
        name
      }
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
      priceTemplates {
        _id
        name
        total
        fields {
          name
          value
          visible
          key
          evaluatedValue
          isCostTemplateField
          costTemplate {
            _id
            name
          }
          fieldId
          dependencyOperator
          dependentUpon
          dependentUponCategory {
            _id
            category {
              categoryId
              categoryName
            }
          }
          attribute {
            _id
            name
            value
          }
          materialOrPart {
            _id
            name
            price
            unitOfPrice {
              _id
              name
            }
          }
        }
      }
      attributeGroups {
        name
        attributes {
          _id
          name
          value
          visible
          actualAttributeId
          unit {
            _id
            name
          }
        }
      }
      createdAt
      updatedAt
      singleProductConfigurator {
        _id
        name
      }
    }
  }
`

export const GET_PRODUCT_ATTRIBUTE = gql`
  query getProductAttribute($parentCategory: ID, $category: ID, $catalogType: String) {
    getProductAttribute(parentCategory: $parentCategory, category: $category, catalogType: $catalogType) {
      _id
      total
      groupName
      attributes {
        _id
        name
        type
        options
        placeHolder
        isRequired
        groupName
        adminAttributeRef
      }
    }
  }
`

export const SEARCH_PRODUCTS = gql`
  query searchProducts($search: String, $sort: sortInput, $filter: String) {
    searchProducts(input: { search: $search, sort: $sort, filter: $filter }) {
      _id
      name
      sku
      thumb
    }
  }
`
