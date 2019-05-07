import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Label, Button, Input } from 'semantic-ui-react'

const CreatePin = props => {
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')

  const onPinInput = (e, { name, value }) => {
    if (name === 'pin1') setPin1(value)
    if (name === 'pin2') setPin2(value)
    if (name === 'pin1' && value.length === 4) {
      const form = e.target.form
      const index = Array.prototype.indexOf.call(form, e.target)
      form.elements[index + 1].focus()
    }
    if (name === 'pin2' && value.length === 4 && pin1 === value) {
      setTimeout(() => document.querySelector('form').dispatchEvent(new Event('submit')), 0)
    }
  }

  const handleSetPin = (e, h) => {
    if (pin2.length >= 4 && pin1 == pin2) {
      props.setPin(pin1)
    }
  }

  const pinsDontMatch = pin2.length >= 4 && pin1 != pin2
  const inputSettings = {
    maxLength: '4',
    type: 'tel',
    pattern: '[-0-9]{4}',
    inputMode: 'numeric',
    style: { width: '80%', margin: '10px 0', fontSize: '20px', textAlign: 'center' }
  }
  return (
    <div className="member-visit-pin">
      <h3>Set your own PIN:</h3>
      <Form onSubmit={handleSetPin}>
        <Form.Field>
          <label htmlFor="pin1">Enter a 4 digit pin</label>
          <Input
            defaultValue={pin1}
            className="member-search"
            name="pin1"
            id="pin1"
            {...inputSettings}
            focus
            onChange={onPinInput}
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="pin2">Confirm Your Pin</label>
          <Input
            defaultValue={pin2}
            name="pin2"
            className="member-search"
            id="pin2"
            error={pinsDontMatch}
            {...inputSettings}
            onChange={onPinInput}
          />
          {pinsDontMatch && (
            <Label color="red" pointing>
              Make sure both PINs match.
            </Label>
          )}
        </Form.Field>
        <Button type="submit" id="setPIN" disabled={pin2.length < 4 || pin1 != pin2} color="green" fluid>
          Set Pin
        </Button>
      </Form>
    </div>
  )
}

CreatePin.propTypes = {
  setPin: PropTypes.func.isRequired
}

export default CreatePin
