import { gql } from 'apollo-server-micro'

export const materialsOrPartGQLSchema = gql`
  type MaterialsOrPart {
    _id: ID
    name: String
    price: Number
    unitOfPrice: Unit
  }
`

export const productGQLSchema = gql`
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

  type Field {
    name: String
    value: String
    visible: Boolean
    key: String
    evaluatedValue: String
    isCostTemplateField: Boolean
    costTemplateId: ID
    dependencyOperator: DependencyOperators
    attribute: Attribute
    dependentUpon: DependentUpon
    dependentUponCategory: CompanyCategory
    materialOrPart: MaterialsOrPart
    fieldId: String
  }

  input FieldInput {
    name: String
    value: String
    visible: Boolean
    key: String!
    evaluatedValue: String
    isCostTemplateField: Boolean
    costTemplateId: ID
    fieldId: String
    dependencyOperator: DependencyOperators
    attribute: ID
    dependentUpon: DependentUpon
    materialOrPart: ID
    dependentUponCategory: ID
  }

  type Product {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    price: Number
    designerNetPrice: Number
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    parentCategory: Category
    category: Category
    thirdCategory: Category
    tags: [ID]
    attributes: [Attribute]
    settings: ProductSettings
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
    priceTemplates: [PriceTemplate]
    attributeGroups: [AttributeCategoryGroup]
  }
  type ProductByID {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    price: Number
    designerNetPrice: Number
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    category: Category
    parentCategory: Category
    thirdCategory: Category
    tags: [Tags]
    attributes: [Attribute]
    settings: ProductSettings
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
    priceTemplates: [PriceTemplate]
    attributeGroups: [AttributeCategoryGroup]
    singleProductConfigurator: Configurator
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
    designerNetPrice: Number
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    parentCategory: ID
    category: ID
    thirdCategory: ID
    tags: [ID]
    attributes: [AttributeInput]
    priceTemplates: [PriceTemplateInput]
    attributeGroups: [AttributeCategoryGroupInput]
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

  type productData {
    count: Int
    data: [Product]
  }

  type ProductAttributeByType {
    _id: String
    total: Int
    groupName: String
    attributes: [ProductAttribute]
  }

  # type Materials {
  #   isTypeOf(obj: MaterialsOrPart): Boolean
  # }

  # type Part {
  #   isTypeOf(obj: MaterialsOrPart): Boolean
  # }

  type Query {
    getAllProduct(input: searchInput): productData
    getProductDetailById(id: ID!): ProductByID
    getProductAttribute(parentCategory: ID, category: ID, catalogType: String): [ProductAttributeByType]
  }

  type Mutation {
    createProduct(data: ProductInput, logInput: logInput): Product
    deleteProduct(id: [ID!], logInput: logInput): deleteRes
    updateProduct(id: ID!, data: ProductInput, logInput: logInput): Product
    updateProductSettings(id: ID!, data: ProductSettingsInput, logInput: logInput): Product
  }
`
