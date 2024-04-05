import { gql } from 'apollo-server-micro'

export const MaterialGQLSchema = gql`
  type Attribute {
    _id: ID
    attrRef: ID
    name: String
    type: String
    value: String
  }

  type Materials {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    price: Number
    designerNetPrice: Number
    unit: String
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    parentCategory: Category
    category: Category
    tags: [ID]
    grade: MaterialGrade
    attributes: [Attribute]
    settings: MaterialSettings
    unitOfPrice: Unit
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type MaterialByID {
    _id: String
    name: String
    sku: String
    uniqueCode: String
    price: Number
    designerNetPrice: Number
    unit: String
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    parentCategory: Category
    category: Category
    tags: [Tags]
    grade: MaterialGrade
    attributes: [Attribute]
    settings: MaterialSettings
    unitOfPrice: Unit
    company: ID
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type materialDatas {
    count: Int
    data: [Materials]
  }

  type Cropper {
    x: Number
    y: Number
    width: Number
    height: Number
    rotate: Number
    scaleX: Number
    scaleY: Number
  }
  type Diffuse {
    value: Number
    color: String
    image: String
  }

  type Aspect {
    ratio: Number
    width: Number
    height: Number
    link: Boolean
  }
  type input {
    value: Number
    image: String
  }
  type Normal {
    value: Number
    image: String
    flipGreen: Boolean
    isActive: Boolean
  }
  type Opacity {
    value: Number
    image: String
    blendMode: String
    isActive: Boolean
  }
  type emission {
    value: Number
    image: String
    isActive: Boolean
  }
  type MaterialSettings {
    shine: Number
    glass: Number
    glossiness: Number
    repeatX: Number
    repeatY: Number
    offsetX: Number
    offsetY: Number
    rotate: Number
    image: String
    roughnessHexColor: String
    metalnessHexColor: String
    imageWidth: Number
    imageHeight: Number
    cropperData: Cropper
    width: Number
    verticalSize: Number
    horizontalSize: Number
    finishSize: Number
    roughnessFactor: Number
    diffuse: Diffuse
    metalness: input
    roughness: input
    normal: Normal
    opacity: Opacity
    aspect: Aspect
    emission: emission
    scale: Number
  }

  input AttributeInput {
    attrRef: ID
    name: String
    type: String
    value: String
  }

  input CropperInput {
    x: Number
    y: Number
    width: Number
    height: Number
    rotate: Number
    scaleX: Number
    scaleY: Number
  }

  input diffuseInput {
    value: Number
    color: String
    image: String
  }

  input Input {
    value: Number
    image: String
  }

  input normalInput {
    value: Number
    image: String
    flipGreen: Boolean
    isActive: Boolean
  }

  input emissionInput {
    value: Number
    image: String
    isActive: Boolean
  }

  input opacityInput {
    value: Number
    image: String
    blendMode: String
    isActive: Boolean
  }

  input aspectInput {
    ratio: Number
    width: Number
    height: Number
    link: Boolean
  }

  input MaterialSettingsInput {
    shine: Number
    glass: Number
    glossiness: Number
    repeatX: Number
    repeatY: Number
    offsetX: Number
    offsetY: Number
    rotate: Number
    image: String
    roughnessHexColor: String
    metalnessHexColor: String
    imageWidth: Number
    imageHeight: Number
    cropperData: CropperInput
    width: Number
    verticalSize: Number
    horizontalSize: Number
    finishSize: Number
    roughnessFactor: Number
    diffuse: diffuseInput
    metalness: Input
    roughness: Input
    normal: normalInput
    opacity: opacityInput
    aspect: aspectInput
    emission: emissionInput
    scale: Number
  }

  input MaterialInput {
    name: String!
    sku: String!
    price: Number
    designerNetPrice: Number
    unit: String
    images: [String]
    description: String
    thumb: String
    status: String
    visibilityStatus: String
    parentCategory: ID
    category: ID
    tags: [ID]
    attributes: [AttributeInput]
    unitOfPrice: ID
    grade: ID
  }

  type Query {
    getAllMaterials(input: searchInput): materialDatas
    getMaterialDetailById(id: ID!): MaterialByID
  }

  type Mutation {
    createMaterial(data: MaterialInput, logInput: logInput): Materials
    deleteMaterials(id: [ID!], logInput: logInput): deleteRes
    updateMaterials(id: ID!, data: MaterialInput, logInput: logInput): Materials
    updateMaterialSettings(id: ID!, data: MaterialSettingsInput, logInput: logInput): Materials
  }
`
