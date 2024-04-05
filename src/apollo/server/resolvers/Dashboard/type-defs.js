
// export const dashboardGQLSchema = `
// type AllModuleCounts  {
//   productCounts: number
//   materialCounts: number
//   partsCounts: number
//   configuratorCounts: number
// }
// input CountInput {
//   name : string
// }
// type Query {
//   getModuleItemsCountsForDashboard (CountInput): AllModuleCounts
// }
// `

import { gql } from "apollo-server-micro";

export const dashboardGQLSchema = gql`

type Attribute {
    _id: ID
    attrRef: ID
    name: String
    type: String
    value: String
}

type Groups {
    components: [String]
    materialCategory: [CompanyCategory]
    name: String
    _id: ID
}

type ProductSettings {
    groups: [Groups]
   image: String
   objUrl: String
   gltfUrl: String
   fbxUrl: String
}

type Product {
    _id: String
    name: String
    sku: String
    price: Number
    thumb:String
}
type ProductByID {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    price: Number
    designerNetPrice:Number
    images: [String]
    description: String
    thumb:String
    status:String
    visibilityStatus: String
    category: Category
    parentCategory: Category
    tags: [Tags]
    attributes: [Attribute]
    settings: ProductSettings
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
}
input AttributeInput {
      attrRef: ID
      name: String
      type: String
      value: String
}
input ProductInput {
    name: String!
    sku: String!
    price: Number
    designerNetPrice:Number
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus:String
    parentCategory: ID
    category: ID
    tags: [ID]
    attributes: [AttributeInput]
}

input GroupsInput {
    components: [String]
    materialCategory: [ID]
    name: String
    _id: ID
}

input ProductSettingsInput {
    groups: [GroupsInput]
   image: String
   objUrl: String
   gltfUrl: String
   fbxUrl: String
}

type productData{
    count: Int
    data: [Product]
}

type ProductAttributeByType {
    _id: String
    total: Int
    groupName: String
    attributes: [ProductAttribute]
}
type AllModuleCounts  {
  productCounts: Number
  materialCounts: Number
  partsCounts: Number
  configuratorCounts: Number
}

type Query {
  getModuleItemsCountsForDashboard( input :String ): AllModuleCounts
}

`