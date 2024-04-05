import { gql } from 'apollo-server-micro'

export const QuotationsSchema = gql`
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

  type Quotation {
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

  type QuotationByID {
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

  input QuotationInput {
    name: String!
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

  type quotationData {
    count: Int
    data: [Quotation]
  }

  type Query {
    getAllQuotations(input: searchInput): quotationData
    getQuotationDetailById(id: ID!): QuotationByID
  }

  type Mutation {
    createQuotation(data: QuotationInput, logInput: logInput): Quotation
    deleteQuotation(id: [ID!], logInput: logInput): deleteRes
    updateQuotation(id: ID!, data: QuotationInput, logInput: logInput): Quotation
  }
`
