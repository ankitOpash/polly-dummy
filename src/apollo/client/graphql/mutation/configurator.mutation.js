import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_CONFIGURATOR = gql`
    mutation createConfigurator($input: ConfiguratorInput , $logInput: logInput){
        createConfigurator(input:$input , logInput: $logInput){
            _id
            name
            uniqueCode
            image
            createdAt
            updatedAt
        }
    }
`

export const DELETE_CONFIGURATOR = gql`
    mutation deleteConfigurators($ids:[ID!] , $logInput: logInput){
        deleteConfigurators(ids:$ids , logInput: $logInput) ${DELETE_RES}
    }
`

export const UPDATE_CONFIGURATOR = gql`
    mutation updateConfigurator($id:ID! , $input:ConfiguratorInput , $logInput: logInput){
        updateConfigurator(id:$id, input:$input , logInput :$logInput){
            _id
            name
            uniqueCode
            image
            createdAt
            updatedAt
        }
    }
`