export const CustomerGQLSchema = `

type Customers {
  _id: ID
  firstName:String
  lastName:String
  email: String
  type: String
  company: String
  verified: Boolean
  status: String
  createdByUserName: String
  createdAt: String
  updatedAt: String
}

type paginateTeCustomers{
  count: Int
  data: [Customers]
}

input CustomerInput {
  firstName:String
  lastName:String
  email:String
  password:String
  type:String
  status: String
  verified:Boolean
  createdByUserName:String
  company:String
}
input UpdateCustomerInput {
  _id :ID
  firstName:String
  lastName:String
  email:String
  password:String
  status: String
  type:String
  createdByUserName:String
  company:String
  verified:Boolean
}
input DeleteInput{
  ids : [String]
}

  type Query {
    getCustomer( input: searchInput ): paginateTeCustomers

  },
  type Mutation{
    addCustomer(input: CustomerInput logInput: logInput ):Customers
    updateCustomer(input: UpdateCustomerInput logInput: logInput ):Customers
    updateCustomerStatus( id: ID! status: String! logInput: logInput ): Boolean
    resetCustomerPassword(password: String! ,userId:String): Boolean
    deleteCustomer(input: DeleteInput logInput: logInput ):deleteRes
  }

`