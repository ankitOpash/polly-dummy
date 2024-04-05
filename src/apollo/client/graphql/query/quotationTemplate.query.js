import { gql } from '@apollo/client'

export const GetAllQuotationTemplates = gql`
  query getAllQuotationTemplates(
    $search: String
    $page: Int
    $limit: Int
    $sort: sortInput
    $filter: String
    $searchField: String
  ) {
    getAllQuotationTemplates(
      input: { search: $search, page: $page, limit: $limit, sort: $sort, filter: $filter, searchField: $searchField }
    ) {
      count
      data {
        templateName
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
  }
`

export const GetQuotationTemplateDetailById = gql`
  query getQuotationTemplateDetailById($id: ID!) {
    getQuotationTemplateDetailById(id: $id) {
      templateName
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
