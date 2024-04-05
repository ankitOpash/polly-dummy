export const SIGN_IN_RES = `
{
       token
        user{
            _id
            email
            avatar
            status
            firstName
            lastName
            phone
            verified
            role {
              _id
              name
              godUsers
              permissions{
               moduleName
                   all
                   view
                   create
                   edit
                   delete
           }
            }
            company {
              _id
              name
              type
            }
         }
  }
`

export const DELETE_RES = `
{
  deletedCount
  deletedList {
    _id
    relatedToText
    message
  }
  rejectedList
  rejectedMessage
}
`