import { gql } from 'apollo-server-micro'

export const userGQLSchema = gql`

input signUpInput {
  email: String!
  password: String!
  companyName: String!
  companyType: String!
  firstName: String!
  lastName: String!
}

input signInInput {
  email: String!
  password: String!
  isMobile: Boolean
  browser: String
  os: String
}

input switchAccountInput {
  id: ID
  token: String
  isMobile: Boolean
  browser: String
  os: String
}

input UserProfileInput {
  firstName: String
  lastName: String
  phone: String
  email: String!
  avatar: String
}

type SignUpRes {
  _id: ID
  id: String
  email: String
  role: ID
  status: String
  company: ID
  verified: Boolean
  createdAt: String
}

type User {
    _id: ID
  id: String
  email: String
  firstName: String
  lastName: String
  phone: String
  role: Role
  avatar: String
  status: String
  company: Company
  verified: Boolean
  createdAt: String
}

type UserProfile {
  _id: ID
id: String
firstName: String
lastName: String
phone: String
email: String
avatar: String
role: String
status: String
company: String
verified: Boolean
createdAt: String
}

type Session {
  _id: ID
  city: String
  region: String
  country: String
  isMobile: Boolean
  browser: String
  os: String
  createdAt: String
}

type SignInRes {
  token: String
  user: User
}

type Query {
    getUser(id: String): UserProfile
    getUserSessions: [Session]
  }

type Mutation {
  signUp(input: signUpInput!): SignUpRes
  signIn(input: signInInput!): SignInRes
  signOut(id: ID token: String isLogoutFromAll: Boolean): Boolean
  verifyEmail(token: String!): Boolean
  resendEmailVerificationLink(email: String!): Boolean
  forgotPassword(email: String!): Boolean
  resetPassword(token: String password: String! enrollment: Boolean,userId:String): Boolean
  changePassword( oldPassword: String! newPassword: String!): Boolean
  changeEmail( email: String!): Boolean
  updateUserProfile(input: UserProfileInput): UserProfile
  switchToAccount(input: switchAccountInput): SignInRes
}

`;