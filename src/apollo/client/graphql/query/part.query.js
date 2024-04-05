import { gql } from "@apollo/client";

export const PART = gql`
   query getAllPart(
        $search: String
        $page: Int
        $limit: Int
        $sort: sortInput
        $searchField: String
    ){
        getAllPart(input:{
            search: $search
            page: $page
            limit: $limit
            sort: $sort
            searchField: $searchField
        })
        {
            count
            data{
                _id
                name
                sku
                images
                description
                thumb
                status
                visibilityStatus
                category {
                    _id
                    categoryName
                }
                parentCategory {
                    _id
                    categoryName
                }
                tags
                company
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

export const GET_PART_BY_ID = gql`
    query GetPartDetailById($id: ID!) {
  getPartDetailById(id: $id) {
    _id
    name
    sku
    uniqueCode
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
    tags {
      name
    }
    attributes {
      _id
      attrRef
      name
      type
      value
  }
    company
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

export const SEARCH_PARTS = gql`
    query searchParts(
        $search: String
        $sort: sortInput
    ){
        searchParts(input:{
            search: $search
            sort: $sort
        }){
            _id
            name
            sku
            thumb
        }
    }
`