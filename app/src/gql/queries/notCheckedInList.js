import gql from 'graphql-tag'

export default gql`
  query notCheckedIn {
    notCheckedIn{
      id
      name
      surname
      avatar
      lastAttend
      isCheckedIn
    }
  }
`