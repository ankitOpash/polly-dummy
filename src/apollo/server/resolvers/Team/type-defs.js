export const teamGQLSchema = `
scalar Number
input TeamInput {
    firstName: String
    lastName: String
    email: String
    password: String
    phone: Number
    role: String
    status:String
}
input TeamUpdateInput {
    _id:String
    firstName: String
    lastName: String
    email: String
    phone: Number
    role: String
    status:String
}

input TeamDeleteInput {
  ids : [String]
}

type Teams {
  _id: String
  firstName: String
  lastName: String
  email: String
  phone: Number
  role: Role
  status:String
  createdByUserName: String
  createdAt: String
  updatedAt: String
}

type paginateTeams {
  count: Int
  data: [Teams]
}

type createdTeams {
    firstName: String
    lastName: String
    email: String
    phone: Number
    role: String
    status:String
}

type Query {
    getTeams( input: searchInput ): paginateTeams
}

type Mutation {

  addTeam( input: TeamInput logInput: logInput): createdTeams
  updateTeam( input: TeamUpdateInput logInput: logInput): createdTeams
  deleteTeam( input: TeamDeleteInput logInput: logInput): deleteRes
  updateTeamStatus( id: ID! status: String! logInput: logInput): createdTeams
}
`