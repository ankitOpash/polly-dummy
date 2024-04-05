import { gql } from '@apollo/client';
import { DELETE_RES } from '../GQLModels';

export const ADD_ROLE = gql`
    mutation createRole($name: String , $permissions: [PermissionInput], $godUsers:Boolean , $logInput: logInput){
        createRole(name:$name , permissions:$permissions , godUsers:$godUsers , logInput: $logInput){
            _id
            name
            permissions{
                moduleName
                    all
                    view
                    create
                    edit
                    delete
            }
            godUsers
            company
            createdAt
        }
    }
`

export const DELETE_ROLE = gql`
   mutation deleteRole($id:[ID!] , $logInput: logInput){
    deleteRole(id:$id , logInput: $logInput) ${DELETE_RES}
   }
`

export const EDIT_ROLE = gql`
    mutation updateRole($id:ID! , $data:RoleInput , $logInput: logInput){
        updateRole(id:$id , data:$data , logInput: $logInput){
        _id
        name
        permissions{
            moduleName
                all
                view
                create
                edit
                delete
        }
        godUsers
        company
        createdAt
    }
    }
`