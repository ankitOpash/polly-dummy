import { gql } from "@apollo/client";

export const TAG = gql`
query getAllTags(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    ){
        getAllTags(input:{
        search: $search
        page: $page
        limit: $limit
        sort: $sort
    }){
        count
        data{
        _id
        name
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

export const TAG_WITHOUT_PAGINATION = gql`
    query getAllTagWithoutPagination($limit: Int ,  $search: String){
        getAllTagWithoutPagination(limit:$limit , search: $search
            ){
        data{
            _id
            name
        }
        }
    }
`