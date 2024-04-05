import { gql } from '@apollo/client'

export const GetAllCollections = gql`
  query getAllCollections($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllCollections(input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }) {
      count
      data {
        _id
        name
        description
        products {
          _id
          name
        }
      }
    }
  }
`

export const GetCollectionById = gql`
  query getCollectionById($id: ID!) {
    getCollectionById(id: $id) {
      _id
      name
      description
      products {
        _id
        name
        price
        category {
          categoryName
        }
      }
    }
  }
`
