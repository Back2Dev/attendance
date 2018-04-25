import gql from 'graphql-tag'

export default gql`
  query ($id: ID) {
    person(id:$id){
      id
      name
      surname
      avatar
      lastAttend
      isCheckedIn
    }
  }
`