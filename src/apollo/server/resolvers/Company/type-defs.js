import { gql } from 'apollo-server-micro'

export const companyGQLSchema = gql`

input companyInput {
  id: String
  email: String
  password: String
  name: String
  type: String
  firstName: String
  lastName: String
  phone: String
}
input helloMutationInput{
  name: String
}

type Company {
  _id: ID
  id: String
  name: String
  uniqueCode: String
  type: String
  logo: String
  status: String
  phone: String
  phoneExtension: String
  email: String
  notes: String
  website: String
  reviewStatus: String
  createdBy: User
  user: User
  createdAt: String
  updatedAt: String
}

type paginateCompanies {
  count: Int
  data: [Company]
}

type helloStr {
  abc: String
}
type HelloMutationOut {
  name: String
}

type Query {
  hello: String
  getCompanies(input: searchInput): paginateCompanies
  getAllCompanies(input: searchInput): [Company]
}

type Mutation {
  helloMutation(input: helloMutationInput): HelloMutationOut
  createCompany(input: companyInput! logInput: logInput): Company
  updateCompany(input: companyInput! logInput: logInput): Company
  deleteCompanies(ids: [ID!]! logInput: logInput): deleteRes
  updateCompanyStatus(id: ID! status: String! logInput: logInput): Company
}
`