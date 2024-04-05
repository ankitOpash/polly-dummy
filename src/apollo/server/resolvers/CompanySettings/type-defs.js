import { gql } from 'apollo-server-micro'

export const companySettingsGQLSchema = gql`

input themeSettingInput {
    layout: String,
    layoutMode: String,
    layoutWidth: String,
    layoutPosition: String,
    topBarTheme: String,
    sidebarSize: String,
    sidebarView: String,
    sidebarTheme: String,
    sidebarImage: String,
    preLoader: String,
    sidebarVisibility: String,
}
input productSettings {
  markupPercentage: Number
  isConfigurable: Boolean
}
input emailSettings {
  email:String
  firstName:String
  lastName:String
}

input modelViewerSettings {
  exposureStatus: Boolean
  exposureValue: Number
  shadowIntensityStatus: Boolean
  shadowIntensityValue: Number
  neutralLighting: Boolean
  zoom: Boolean
  environmentImage: String
}

type ThemeSettings {
    layout: String,
    layoutMode: String,
    layoutWidth: String,
    layoutPosition: String,
    topBarTheme: String,
    sidebarSize: String,
    sidebarView: String,
    sidebarTheme: String,
    sidebarImage: String,
    preLoader: String,
    sidebarVisibility: String,
}
type ProductSettings {
  markupPercentage: Number
  isConfigurable: Boolean
}

type EmailSettings {
  email: String
  firstName: String
  lastName: String
}

type CompanySetting {
  _id: ID
  id: String
  themeSettings: ThemeSettings
  productSettings: ProductSettings
  emailSettings: EmailSettings
  modelViewerSettings: ModelViewerSettingsSchema
}
type ProductSettings {
  _id: ID
  id: String
  productSettings: ProductSettings
}

type EmailSettings {
  _id: ID
  id: String
  emailSettings: EmailSettings
}

type Exposure {
  isActive: Boolean
  value: Number
}

type ModelViewerSettingsSchema {
  exposure: Exposure
  shadowIntensity: Exposure
  neutralLighting: Boolean
  zoom: Boolean
  environmentImage: String
}

type ModelViewerSettings {
  _id: ID
  id: String
  modelViewerSettings: ModelViewerSettingsSchema
}

type Query {
  getCompanySettings: CompanySetting
}

type Mutation {
  updateThemeSetting(input: themeSettingInput!): CompanySetting
  updateProductSetting(input: productSettings!): ProductSettings
  updateEmailSettings(input: emailSettings!): EmailSettings
  updateModelViewerSettings(input: modelViewerSettings!): ModelViewerSettings
}
`