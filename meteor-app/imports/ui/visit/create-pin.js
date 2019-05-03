import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header } from 'semantic-ui-react'

const Arrive = props => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div>
        <Header as="h3">Create PIN </Header>
        <div style={{ display: 'flex', justifyContent: 'space-around' }} />
      </div>

      <Button
        onClick={() => props.history.push(`/visit/${props.match.params.id}/select-activity`)}
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
