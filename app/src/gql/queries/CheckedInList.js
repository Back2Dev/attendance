import gql from 'graphql-tag'

export default gql`
  query CheckedInList {
    checkedIn{
      id
      name
      surname
      avatar
      lastAttend
      isCheckedIn
    }
  }
`