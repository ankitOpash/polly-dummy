import { gql } from 'apollo-server-micro'

export const QuotationTemplatesSchema = gql`
  type Address {
    street: String
    city: String
    state: String
    country: String
    zip: String
  }

  type QuotationExtraFields {
    key: String
    value: String
  }

  input AddressInput {
    street: String
    city: String
    state: String
    country: String
    zip: String
  }

  type PaymentDetails {
    paymentMethod: String
  }

  input PaymentDetailsInput {
    paymentMethod: String
  }

  type PaymentAmounts {
    subTotal: String
    # estimatedTax: String
    # discount: String
    # shippingCharge: String
    totalAmount: String
  }

  input PaymentAmountsInput {
    subTotal: String
    # estimatedTax: String
    # discount: String
    # shippingCharge: String
    totalAmount: String
  }

  type QuotationTemplate {
    templateName: String
    _id: String
    name: String
    customerName: Customers
    address: Address
    invoiceNumber: String
    date: String
    paymentStatus: String
    totalAmount: String
    billingAddress: Address
    shippingAddress: Address
    products: [Product]
    hotTableData: String
    paymentMethod: PaymentDetails
    paymentAmounts: PaymentAmounts
    notes: String
    createdBy: User
    extraFields: [QuotationExtraFields]
    extraTotalFields: [QuotationExtraFields]
  }

  type QuotationTemplateByID {
    templateName: String
    _id: String
    name: String
    customerName: Customers
    address: Address
    invoiceNumber: String
    date: String
    paymentStatus: String
    totalAmount: String
    billingAddress: Address
    shippingAddress: Address
    products: [Product]
    hotTableData: String
    paymentMethod: PaymentDetails
    paymentAmounts: PaymentAmounts
    notes: String
    createdBy: User
    extraFields: [QuotationExtraFields]
    extraTotalFields: [QuotationExtraFields]
  }

  input QuotationExtraFieldsInput {
    key: String
    value: String
  }

  input QuotationTemplateInput {
    templateName: String!
    name: String
    customerName: ID
    address: AddressInput
    invoiceNumber: String
    date: String
    paymentStatus: String
    totalAmount: String
    billingAddress: AddressInput
    shippingAddress: AddressInput
    products: [ID]
    hotTableData: String
    paymentMethod: PaymentDetailsInput
    paymentAmounts: PaymentAmountsInput
    notes: String
    extraFields: [QuotationExtraFieldsInput]
    extraTotalFields: [QuotationExtraFieldsInput]
  }

  type quotationTemplatesData {
    count: Int
    data: [QuotationTemplate]
  }

  type Query {
    getAllQuotationTemplates(input: searchInput): quotationTemplatesData
    getQuotationTemplateDetailById(id: ID!): QuotationTemplateByID
  }

  type Mutation {
    createQuotationTemplate(data: QuotationTemplateInput, logInput: logInput): QuotationTemplate
    deleteQuotationTemplate(id: [ID!], logInput: logInput): deleteRes
    updateQuotationTemplate(id: ID!, data: QuotationTemplateInput, logInput: logInput): QuotationTemplate
  }
`
