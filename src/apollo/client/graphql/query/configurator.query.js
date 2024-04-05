import { gql } from '@apollo/client';

export const GET_ALL_CONFIGURATORS = gql`
query getAllConfigurators(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    $filter: String
    ){
        getAllConfigurators(input:{
        search: $search
        page: $page
        limit: $limit
        sort: $sort
        filter: $filter
    }){
        count
        data{
        _id
        name
        uniqueCode
        type
        image
        company
        createdByUserName
        createdAt
        updatedAt
        }
    }
}
`

export const GET_CONFIGURATOR = gql`
query getConfigurator($id: ID)
{
        getConfigurator(id: $id){
        _id
        name
        uniqueCode
        company
        products {
            _id
            name
            sku
            thumb
        }
    }
}
`