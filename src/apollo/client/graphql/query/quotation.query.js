import { gql } from '@apollo/client'

export const GetAllQuotations = gql`
  query getAllQuotations(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    $filter: String
    $searchField: String
  ) {
    getAllQuotations(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, filter: $filter, searchField: $searchField }
    ) {
      count
      data {
        _id
        name
        date
        customerName {
          _id
          firstName
          lastName
          email
        }
        paymentAmounts {
          totalAmount
        }
      }
    }
  }
`

export const GetQuotationDetailById = gql`
  query getQuotationDetailById($id: ID!) {
    getQuotationDetailById(id: $id) {
      _id
      name
      customerName {
        _id
        firstName
      }
      address {
        city
        country
        state
        street
        zip
      }
      invoiceNumber
      date
      paymentStatus
      totalAmount
      billingAddress {
        city
        country
        state
        street
        zip
      }
      shippingAddress {
        city
        country
        state
        street
        zip
      }
      products {
        _id
        name
        sku
        price
        description
      }
      hotTableData
      paymentMethod {
        paymentMethod
      }
      paymentAmounts {
        subTotal
        # estimatedTax
        # discount
        # shippingCharge
        totalAmount
      }
      notes
      extraFields {
        key
        value
      }
      extraTotalFields {
        key
        value
      }
    }
  }
`
