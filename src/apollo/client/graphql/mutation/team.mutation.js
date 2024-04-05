import { gql } from "@apollo/client";
import { DELETE_RES } from "../GQLModels";

export const ADD_TEAM = gql`
mutation addTeam($input: TeamInput $logInput: logInput) {
  addTeam(input: $input logInput: $logInput) {
    firstName
    lastName
    email
    phone
    role
    status
  }
}
`

export const UPDATE_TEAM = gql`
mutation updateTeam($input: TeamUpdateInput $logInput: logInput) {
  updateTeam(input: $input logInput: $logInput) {
    firstName
    lastName
    email
    phone
    role
  }
}

`

export const DELETE_TEAM = gql`
mutation deleteTeam($teamDeleteInput: TeamDeleteInput $logInput: logInput) {
  deleteTeam(input: $teamDeleteInput logInput: $logInput) ${DELETE_RES}
}
`

export const UPDATE_TEAM_STATUS = gql`
mutation updateTeamStatus($status: String! $id: ID! $logInput: logInput) {
  updateTeamStatus( status: $status id: $id logInput: $logInput){
    firstName
    lastName
    email
    phone
    role
    status
  }
}
`