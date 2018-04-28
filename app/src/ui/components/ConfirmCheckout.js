import React from 'react'
import { graphql } from 'react-apollo'
import query from '../../gql/queries/personFetch'
import nextQuery from '../../gql/queries/CheckedInList'
import otherQuery from '../../gql/queries/notCheckedInList'
import { CheckOut } from '../../gql/mutations/CheckInOut'
import { Button, Loader, Segment } from 'semantic-ui-react'
import Avatar from './Avatar'

const ConfirmCheckout = (props) => {

const handleCheckout = (id) => {
  props.mutate({
    variables: {id},
    refetchQueries: [{ query: nextQuery }, { query: otherQuery }]
  })
  .then(props.history.goBack())
}

const handleCancel = () => props.history.goBack()

  if (props.data.loading) {return <Loader active inline='centered'/>}

  let { id, name, surname, isCheckedIn, avatar } = props.data.person

  return (
    <Segment style={{ marginTop: '7em' }}>
      <Avatar
        _id={id}
        firstName={name}
        lastName={surname}
        isCheckedIn={isCheckedIn}
        fileName={avatar}
      />

      <Button.Group>
        <Button onClick={ () => handleCancel() }>Cancel</Button>
        <Button.Or />
        <Button positive
          onClick={ () => handleCheckout(id) }> Check Out
        </Button>
      </Button.Group>  

    </Segment>
  )

}

export default graphql(query, 
  {
    options: (props) => { return {variables: {id: props.match.params.id} }}
  })
  (graphql(CheckOut)(ConfirmCheckout)
)