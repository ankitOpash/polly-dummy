import { gql } from '@apollo/client';

export const CREATE_ATTRIBUTE_GROUP = gql`
mutation createAttributeGroup(
  $input: [AttributeGroupInput]
 ) {
  createAttributeGroup(
         input: $input
     ) {
         rejectedMsg
         successMsg
     }
 }
`