import { gql } from "@apollo/client";

export const GET_PRODUCT_SETTINGS = gql`
query getCompanySettings{
    getCompanySettings {
      productSettings {
        markupPercentage
        isConfigurable
      }
    }
  }
`

export const GET_EMAIL_SETTINGS = gql`
query getCompanySettings{
    getCompanySettings {
      emailSettings{
      email
      firstName
      lastName
    }
    }
  }
`

export const GET_MODEL_VIEWER_SETTINGS = gql`
query getCompanySettings{
    getCompanySettings {
      modelViewerSettings {
        exposure {
          isActive
          value
        }
        shadowIntensity {
          isActive
          value
        }
        neutralLighting
        zoom
        environmentImage
        }
    }
  }
`

export const GET_COMPANY_SETTINGS = gql`
query getCompanySettings{
    getCompanySettings {
      _id
      productSettings {
        markupPercentage
        isConfigurable
      }
    }
  }
`