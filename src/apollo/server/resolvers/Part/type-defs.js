import { gql } from "apollo-server-micro";

export const PartGQLSchema = gql`
 
type Attribute {
    _id: ID
    attrRef: ID
    name: String
    type: String
    value: String
}

type Part {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    images: [String]
    description: String
    thumb:String
    status:String
    visibilityStatus: String
    parentCategory: Category
    category: Category
    tags: [ID]
    attributes: [Attribute]
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
}
type PartByID {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    images: [String]
    description: String
    thumb:String
    status:String
    visibilityStatus: String
    parentCategory: Category
    category: Category
    tags: [Tags]
    attributes: [Attribute]
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
input PartInput {
    name: String
    sku: String
    images: [String!]
    description: String
    thumb: String
    status: String
    visibilityStatus:String
    parentCategory: ID
    category: ID
    tags: [ID]
    attributes: [AttributeInput]
}

type PartData{
    count:Int
    data:[Part]
}


type Query{
    getAllPart(input:searchInput):PartData
    getPartDetailById(id:ID!):PartByID
}

type Mutation{
    createPart(data: PartInput , logInput: logInput): Part
    deletePart(id:[ID!] , logInput:logInput): deleteRes
    updatePart(id:ID! , data:PartInput , logInput: logInput): Part
}
`