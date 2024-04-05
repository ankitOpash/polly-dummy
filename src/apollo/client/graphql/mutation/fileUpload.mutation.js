import { gql } from '@apollo/client';

export const GENERATE_PRE_SIGN_URL = gql`
    mutation generatePreSignURL($fileUploadPath: String! $type: String!){
      generatePreSignURL(fileUploadPath:$fileUploadPath type: $type) {
        url
        fileName
      }
   }
`

export const GENERATE_MULTIPLE_PRE_SIGN_URL = gql`
    mutation generateMultiplePreSignURL($fileUploadPath: [String] $type: String){
      generateMultiplePreSignURL(fileUploadPath:$fileUploadPath type: $type) {
        url
        fileName
      }
   }
`