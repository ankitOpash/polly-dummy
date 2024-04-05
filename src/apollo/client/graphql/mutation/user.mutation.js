import { gql } from '@apollo/client';
import { SIGN_IN_RES } from '../GQLModels';

export const SIGN_UP = gql`
   mutation signUp($input: signUpInput!){
      signUp(input: $input) {
         _id
         email
         status
         verified
         role
         company
      }
   }
`

export const SIGN_IN = gql`
  mutation signIn($input: signInInput!){
    signIn(input:$input) ${SIGN_IN_RES}
}
`

export const UPDATE_USER_PROFILE = gql`
   mutation updateUserProfile(
      $input: UserProfileInput
      ) {
         updateUserProfile(
         input: $input
         ) {
         _id
         id
         firstName
         lastName
         phone
         email
         avatar
         role
         status
         company
         verified
         createdAt
      }
   }
`

export const FORGOT_PASS = gql`
   mutation forgotPassword($email: String!){
     forgotPassword(email:$email)
   }
`

export const RESET_PASS = gql`
    mutation resetPassword($token: String $password: String! $enrollment: Boolean $userId: String){
      resetPassword(token:$token password: $password enrollment: $enrollment userId:$userId)
   }
`

export const CHANGE_PASS = gql`
    mutation changePassword($oldPassword: String! $newPassword: String!){
      changePassword(oldPassword:$oldPassword newPassword: $newPassword)
   }
`

export const CHANGE_EMAIL = gql`
    mutation changeEmail($email: String!){
      changeEmail(email:$email)
   }
`

export const VERIFY_EMAIL = gql`
    mutation verifyEmail($token: String!){
      verifyEmail(token:$token)
   }
`

export const RESEND_EMAIL_VERIFICATION_LINK = gql`
   mutation resendEmailVerificationLink($email: String!){
     resendEmailVerificationLink(email:$email)
   }
`

export const SIGN_OUT = gql`
   mutation signOut($token:String $id: ID $isLogoutFromAll: Boolean) {
      signOut(token: $token id: $id isLogoutFromAll: $isLogoutFromAll)
   }
`

export const SWITCH_ACCOUNT = gql`
   mutation switchToAccount($input: switchAccountInput) {
      switchToAccount(input: $input) ${SIGN_IN_RES}
   }
`