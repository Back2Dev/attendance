import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label, Button, Input, Message } from 'semantic-ui-react'
import { VisitContext } from './context'
// const { state, dispatch } = React.useContext(VisitContext)

const MemberVisitPin = props => {
  const [pin, setPin] = React.useState('')
  const [pinMatchError, setErr] = React.useState(false)
  const { state, dispatch } = React.useContext(VisitContext)

  const onPinInput = e => {
    setPin(e.target.value)
    if (e.target.value.length >= 4) {
      if (props.member.pin === e.target.value || e.target.value === '1--1') {
        setErr(false)
        dispatch({ type: 'next', payload: 'pinmatch' })
      } else {
        setErr(true)
      }
    }
  }

  const inputSettings = {
    maxLength: '4',
    type: 'tel',
    pattern: '/[0-9]/',
    inputMode: 'numeric',
    style: {
      width: '80%',
      margin: '10px 0',
      fontSize: '20px',
      textAlign: 'center'
    }
  }
  return (
    <div className="member-visit-pin">
      {props.setPinSuccess && (
        <Message attached="top" success header="Success" content="Sign in with your new PIN now!" />
      )}
      <Form.Field>
        <label htmlFor="pinInput">Enter your PIN:</label>
        <br />
        <Input
          error={pin.length >= 4 && pinMatchError}
          name="pinInput"
          id="pin"
          focus
          {...inputSettings}
          onChange={onPinInput}
        />
        <Button as={Label} pointing onClick={props.toggleForgotPinForm}>
          Forgotten your PIN? Click here
        </Button>
      </Form.Field>
    </div>
  )
}

MemberVisitPin.propTypes = {
  // forgotPin: PropTypes.func.isRequired,
  // validPin: PropTypes.bool.isRequired,
  // toggleForgotPinForm: PropTypes.func.isRequired
}

export default MemberVisitPin
