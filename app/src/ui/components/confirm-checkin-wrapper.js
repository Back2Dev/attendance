import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import query from '../../gql/queries/personFetch'
import nextQuery from '../../gql/queries/CheckedInList'
import otherQuery from '../../gql/queries/notCheckedInList'
import { CheckIn } from '../../gql/mutations/CheckInOut'

import ConfirmCheckin from './confirm-checkin'

const ConfirmCheckinWrapper = (props) => {

  const handleCancel = () => props.history.goBack()

  const handleCheckin = (id) => {
    props.mutate({
      variables: {id},
      refetchQueries: [{ query: nextQuery }, { query: otherQuery }]
    })  
    .then(props.history.goBack())
  }

console.log(props.data);
  return (
    <ConfirmCheckin
      loading={props.data.loading}
      person={props.data.person}
      isCheckedIn={props.data.isCheckedIn}
      cancel={handleCancel}
      checkin={handleCheckin}
    />
  ) 

}

ConfirmCheckinWrapper.Proptypes = {
  data: PropTypes.object.isRequired,
}

export default graphql(query, 
  {
    options: (props) => { return {variables: {id: props.match.params.id} }}
  })
  (graphql(CheckIn)(ConfirmCheckinWrapper)
)