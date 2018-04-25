import gql from 'graphql-tag'

export default gql`
  query ($term: String, $isCheckedIn: Boolean) {
    people(searchTerm:$term, isCheckedIn:$isCheckedIn){
      id
      name
      surname
      avatar
      lastAttend
      isCheckedIn
    }
  }
`