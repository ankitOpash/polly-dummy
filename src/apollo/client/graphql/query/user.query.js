import { gql } from '@apollo/client';

export const GET_USER = gql`
   query getUser($id: String){
    getUser(id: $id) {
        _id
        id
        firstName
        lastName
        phone
        email
        avatar
        company
      }
   }
`

export const GET_USER_SESSION = gql`
   query getUserSessions{
    getUserSessions {
        _id
         city
         region
         country
         isMobile
         browser
         os
         createdAt
      }
   }
`