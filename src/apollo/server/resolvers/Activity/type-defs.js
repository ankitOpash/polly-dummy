
export const activityGQLSchema = `

type Activity {
  action: String
  actionOn: String
  actionId: ID
  message: String
  createdAt: String
  createdByUserName: String
}

type paginateActivities {
  count: Int
  data: [Activity]
}

type Query {
  getActivities( input: searchInput ): paginateActivities
}
`