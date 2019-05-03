import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header } from 'semantic-ui-react'

const Arrive = props => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div>
        <Header as="h3">Signed in </Header>
        <div style={{ display: 'flex', justifyContent: 'space-around' }} />
      </div>

      <Button
        onClick={() => props.history.push(`/visit/${props.match.params.id}/create-pin`)}
        positive
        fluid
        id="signIn"
        size="large"
      >
        Next
      </Button>
    </div>
  )
}

Arrive.propTypes = {}

export default Arrive
