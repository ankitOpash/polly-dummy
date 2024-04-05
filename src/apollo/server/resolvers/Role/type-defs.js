import { gql } from 'apollo-server-micro'

export const roleGQLSchema = gql`

type Permission {
    moduleName: String
    all: Boolean
    view: Boolean
    create: Boolean
    edit: Boolean
    delete: Boolean
    createdByMe: Boolean
    bulkImport: Boolean
    bulkExport: Boolean
}
input PermissionInput {
  moduleName: String
  all: Boolean
  view: Boolean
  create: Boolean
  edit: Boolean
  delete: Boolean
  createdByMe: Boolean
  bulkImport: Boolean
  bulkExport: Boolean
}
input UserPermissionsInput {
  all: Boolean
  create: Boolean
  edit: Boolean
  view: Boolean
  delete: Boolean
  createdByMe: Boolean
  bulkImport: Boolean
  bulkExport: Boolean
  exportExcelPdf: Boolean
  moduleName: String
}
type Role {
  _id: ID
  name: String
  permissions: [Permission]
  godUsers: Boolean
  company: ID
  createdBy: User
  createdAt: String
  updatedAt: String
}

type createdRoles{
  _id: ID
  name: String
  permissions: [Permission]
  godUsers: Boolean
  company: ID
}

input RoleInput {
  name: String
  permissions: [PermissionInput]
  godUsers: Boolean
}

type RoleData{
  count: Int
  data: [Role]
}

type Query{
  getAllRole(input: searchInput):RoleData
  getAllRoleWithoutPagination:RoleData
  getUserRole(roleId: ID!): Role
}
 type Mutation {
  createRole(name: String , permissions: [PermissionInput], godUsers:Boolean , logInput: logInput ):Role
  deleteRole(id:[ID!] , logInput: logInput): deleteRes
  updateRole(id:ID! , data:RoleInput , logInput: logInput):Role
}

`