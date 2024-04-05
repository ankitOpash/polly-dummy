import { gql } from "@apollo/client";

export const UPDATE_THEME_SETTINGS = gql`
  mutation updateThemeSetting($input: themeSettingInput!){
    updateThemeSetting(input: $input) {
      themeSettings {
        layout
        layoutMode
        layoutWidth
        layoutPosition
        topBarTheme
        sidebarSize
        sidebarView
        sidebarTheme
        sidebarImage
        preLoader
        sidebarVisibility
      }
    }
  }
`