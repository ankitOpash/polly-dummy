import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_CONFIGURATOR_GROUP = gql`
    mutation createConfiguratorGroup($input: ConfiguratorGroupInput , $logInput: logInput){
        createConfiguratorGroup(input:$input , logInput: $logInput){
            _id
            name
            isRequired
            options {
              optionName
              description
              type
            }
            createdAt
            updatedAt
        }
    }
`

export const UPDATE_CONFIGURATOR_GROUP = gql`
    mutation updateConfiguratorGroup($id: ID! $input: ConfiguratorGroupInput , $logInput: logInput){
        updateConfiguratorGroup(id:$id input:$input , logInput: $logInput){
            _id
            name
            isRequired
            options {
              optionName
              description
              type
            }
            createdAt
            updatedAt
        }
    }
`

export const DELETE_CONFIGURATOR_GROUP = gql`
    mutation deleteConfiguratorGroups($ids:[ID!] , $logInput: logInput){
        deleteConfiguratorGroups(ids:$ids , logInput: $logInput) ${DELETE_RES}
    }
`