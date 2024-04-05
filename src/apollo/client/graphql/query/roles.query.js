import { gql } from "@apollo/client";

export const ROLE = gql`
query getAllRole(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    ){
    getAllRole(input:{
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
        permissions{
            moduleName
                all
                view
                create
                edit
                delete
        }
        godUsers
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

export const GET_USER_ROLE = gql`
     query getUserRole($roleId:ID!){
        getUserRole(roleId:$roleId){
        _id
        name
        company
        permissions{
            moduleName
                all
                view
                create
                edit
                delete
        }
        godUsers
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