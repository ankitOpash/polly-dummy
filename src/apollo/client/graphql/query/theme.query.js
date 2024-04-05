import { gql } from "@apollo/client";

export const GET_THEME_SETTINGS = gql`
query getCompanySettings{
    getCompanySettings {
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