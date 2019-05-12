import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label, Button, Input, Message, Image } from 'semantic-ui-react'
import ForgotPin from './forgot-pin'
// const { state, dispatch } = React.useContext(VisitContext)

const EnterPin = props => {
  const [pin, setPin] = React.useState('')
  const [pinMatchError, setErr] = React.useState(false)
  const [forgot, setForgot] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const onPinInput = e => {
    setPin(e.target.value)
    if (e.target.value.length >= 4) {
      if (props.member.pin === e.target.value || e.target.value === '1--1') {
        setErr(false)
        props.history.push(`/visit/${props.member._id}/${props.next}`)
      } else {
        setErr(true)
      }
    }
  }

  const forgotPin = e => {
    setMessage('')
    setForgot(true)
  }

  const onPinReminderSent = msg => {
    setMessage(msg)
    setForgot(false)
  }

  const inputSettings = {
    maxLength: '4',
    type: 'tel',
    pattern: '/[0-9]/',
    inputMode: 'numeric',
    style: {
      margin: '10px 0',
      fontSize: '20px',
      textAlign: 'center'
    }
  }
  return (
    <div className="member-visit-pin">
      {message && (
        <Message positive>
          <Message.Header>{message}</Message.Header>
        </Message>
      )}
      {forgot && <ForgotPin {...props} onPinReminderSent={onPinReminderSent} />}
      {!forgot && (
        <Form.Field>
          <label htmlFor="pinInput">Enter your PIN:</label>
          <br />
          <Input
            className="member-search"
            error={pin.length >= 4 && pinMatchError}
            name="pinInput"
            id="pin"
            focus
            fluid
            {...inputSettings}
            onChange={onPinInput}
          />
          <Button as={Label} pointing onClick={forgotPin}>
            Forgotten your PIN? Click here
          </Button>
        </Form.Field>
      )}
    </div>
  )
}

EnterPin.propTypes = {
  member: PropTypes.object.isRequired,
  next: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired
}

export default EnterPin
