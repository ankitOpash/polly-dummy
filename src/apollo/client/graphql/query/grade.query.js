import { gql } from "@apollo/client";

export const GRADE = gql`
    query getAllGrade(
        $search: String
        $page: Int
        $limit: Int
        $sort: sortInput
    ){
        getAllGrade(input:{
            search:$search
            page:$page
            limit:$limit
            sort:$sort
        }){
            count
            data{
                _id
                grade
                company
                createdBy {
                    _id
                    email
                    firstName
                    lastName
                  }
                createdAt
                updatedAt
            }
        }
    }
`

export const SEARCH_MATERIAL_GRADES = gql`
    query getAllGradeWithoutPagination(
        $search: String
    ){
        getAllGradeWithoutPagination(search:$search){
            _id
            grade
        }
    }

`