import React from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default UserDetailForm = ({ formData, updateMemberPassword }) => {
  const [data, setData] = React.useState(formData)
  const [newPin, setNewPin] = React.useState(formData.pin)
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPass, setConfirmPass] = React.useState('')
  const [error, setError] = React.useState(null)

  const handleSubmit = (e, h) => {
    setError(null)
    if (data.pin.length !== 4) {
      return setError('Pin number must be 4 digits')
    } else if (newPin !== data.pin) {
      return setError('Pin does not match')
    }
    if (newPassword !== confirmPass) {
      return setError('Passwords must be the same ')
    }
    updateMemberPassword(data, confirmPass)
    // When updating email: Update email in member's collection and username + email in user's collection
  }

  return (
    <>
      {error ? <Message error header={error} /> : null}
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Email"
          value={data.email}
          onChange={e => {
            setData({ ...data, email: e.target.value })
          }}
        />

        <Form.Input
          label="Password"
          type="password"
          value={newPassword}
          onChange={e => {
            setNewPassword(e.target.value)
          }}
        />

        <Form.Input
          label="Confirm Password"
          type="password"
          value={confirmPass}
          onChange={e => {
            setConfirmPass(e.target.value)
          }}
        />

        <Form.Input
          id="form-pin"
          label="Pin"
          value={newPin}
          onChange={e => {
            setNewPin(e.target.value)
          }}
        />

        <Form.Input
          label="Confirm New Pin"
          onChange={e => {
            setData({ ...data, pin: e.target.value })
          }}
        />

        <Button type="submit">Submit</Button>
      </Form>
    </>
  )
}

UserDetailForm.propTypes = {
  formData: PropTypes.object.isRequired,
  updateMemberPassword: PropTypes.func.isRequired
}
