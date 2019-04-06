import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header } from 'semantic-ui-react'

const Arrive = props => {
  const eventStart = event => {
    props.setDuration(event.duration)
    props.updateStatus()
  }
  return (
    <div style={{ padding: '20px 0' }}>
      {props.member && !props.member.isHere && (
        <div>
          <Header as="h3">Welcome! What are you here for today?</Header>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {props.events &&
              props.events.length &&
              props.events.map(event => (
                <Button
                  type="button"
                  onClick={() => eventStart(event)}
                  positive
                  key={event._id}
                  id={event.name}
                  size="large"
                >
                  {event.name}
                </Button>
              ))}
          </div>
        </div>
      )}
      {props.member && props.member.isHere && (
        <div>
          <Header as="h4">See you next time!</Header>
          <Button onClick={() => props.updateStatus()} positive fluid id="signIn" size="large">
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
}

Arrive.propTypes = {
  member: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  setDuration: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired
}

export default Arrive
