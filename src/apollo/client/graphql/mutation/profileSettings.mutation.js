import { gql } from "@apollo/client";

export const UPDATE_PRODUCT_SETTINGS = gql`
  mutation updateProductSetting($input: productSettings!){
    updateProductSetting(input: $input) {
        productSettings {
            markupPercentage
            isConfigurable
        }
    }
  }
`

export const UPDATE_EMAIL_SETTINGS = gql`
 mutation updateEmailSettings($input: emailSettings!){
    updateEmailSettings(input: $input) {
     emailSettings{
      email
      firstName
      lastName
    }
    }
  }
`

export const UPDATE_MODEL_VIEWER_SETTINGS = gql`
  mutation updateModelViewerSettings($input: modelViewerSettings!){
    updateModelViewerSettings(input: $input) {
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