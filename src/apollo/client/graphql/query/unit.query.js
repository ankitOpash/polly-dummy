import { gql } from '@apollo/client'

export const GetAllUnits = gql`
  query getAllUnits($search: String, $page: Int, $limit: Int, $sort: sortInput, $searchField: String) {
    getAllUnits(input: { search: $search, page: $page, limit: $limit, sort: $sort, searchField: $searchField }) {
      count
      data {
        _id
        name
        createdBy {
          _id
          name
        }
      }
    }
  }
`

export const GetUnitById = gql`
  query getUnitById($id: ID!) {
    getUnitById(id: $id) {
      _id
      name
      createdBy {
        _id
        name
      }
    }
  }
`
