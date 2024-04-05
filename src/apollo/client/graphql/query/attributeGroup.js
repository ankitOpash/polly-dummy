import { gql } from '@apollo/client';

export const GET_ATTRIBUTE_GROUP = gql`
   query getAttributeGroups {
      getAttributeGroups {
        _id
        name
    }
   }
`