import React from 'react'
import { graphql } from 'react-apollo'
import query from '../../gql/queries/notCheckedInList'
import SearchablePeople from './SearchablePeople'
import { withRouter } from 'react-router-dom'

const CheckinList = (props) => {

  const handleCheckin = (id) => {
    props.history.push(`/people/${id}/confirmCheckin`)
  }

  return (
    <SearchablePeople isCheckedIn={false} onTapAction={handleCheckin} backgroundColor={'Snow'} />
  ) 
}

export default withRouter(graphql(query)(CheckinList))