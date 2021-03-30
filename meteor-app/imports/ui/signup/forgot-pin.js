import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Label, Input, Checkbox, Modal } from 'semantic-ui-react'
import Alert from 'react-s-alert'

const fieldMap = {
  email: 'email',
  sms: 'mobile',
}

const ForgotPin = (props) => {
  const [value, setValue] = useState('')
  const [method, setMethod] = useState('email')
  const [remember, setRemember] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const onDeliverySelection = (e, { name }) => {
    setMethod([name])
    if (!allowEntry) setValue(props.member[fieldMap[name]])
  }

  const handleSubmit = (e, h) => {
    let sendValue = value
    if (!sendValue && props.member[fieldMap[method]]) sendValue = props.member[fieldMap[method]]
    props.forgotPin(method, sendValue, remember)
    setModalOpen(false)
    Alert.info(`Your PIN was sent to ${sendValue}`)
  }

  const onInput = (e, { value }) => {
    setValue(value)
  }
  const message = method == 'email' ? 'email address' : 'mobile phone number'
  const allowEntry = !props.member.email && !props.member.mobile
  return (
    <Modal
      trigger={
        <a
          pointing
          onClick={() => {
            setModalOpen(true)
          }}
          style={{ cursor: 'pointer' }}
        >
          Forgotten Pin
        </a>
      }
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      basic
      size="small"
    >
      <div style={{ textAlign: 'center' }}>
        <h3>Select best way to send your PIN reminder:</h3>
        <br />
        <Form onSubmit={handleSubmit}>
          <Button.Group size="small">
            <Button
              name={'email'}
              size="small"
              type="button"
              positive={method == 'email'}
              onClick={onDeliverySelection}
            >
              Email: {props.member.email}
            </Button>
            {props.member.mobile && props.member.email && <Button.Or />}
            {props.member.mobile && (
              <Button name={'sms'} size="small" type="button" positive={method == 'sms'} onClick={onDeliverySelection}>
                SMS: {props.member.mobile}
              </Button>
            )}
          </Button.Group>
          <br />

          <Form.Field>
            <input hidden type="radio" checked={method == 'email'} name="email" onChange={onDeliverySelection} />
            <input hidden type="radio" checked={method == 'sms'} name="sms" onChange={onDeliverySelection} />
            {allowEntry && (
              <div>
                <br />
                <label>Enter your {message}</label>
                <br />
                <Input fluid name={method} defaultValue={value} onChange={onInput} />
                <Checkbox
                  label="Save this to my profile"
                  name="remember"
                  defaultChecked={remember}
                  onChange={(e, data) => {
                    setRemember(data.checked)
                  }}
                />
              </div>
            )}
            {!allowEntry && <input type="hidden" name={method} />}
          </Form.Field>
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </Modal>
  )
}

ForgotPin.propTypes = {
  onPinReminderSent: PropTypes.func.isRequired,
}

export default ForgotPin
