import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header } from 'semantic-ui-react'

const mkid = name => name.toLowerCase().replace(/[\W+]/, '_')

const SelectActivity = props => {
  const eventStart = event => {
    props.recordVisit(event)
  }
  return (
    <div style={{ padding: '20px 0' }}>
      {props.member && (
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
                  id={mkid(event.name)}
                  size="large"
                >
                  {event.name}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

SelectActivity.propTypes = {
  member: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  recordVisit: PropTypes.func.isRequired
}

export default SelectActivity
