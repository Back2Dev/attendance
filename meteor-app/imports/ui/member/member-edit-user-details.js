import React from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'

export default UserDetailForm = ({ formData, setUser, setMember, setPassword }) => {
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
    setMember(data)
    setUser(data)
    setPassword(data, confirmPass)
    // When updating email: Update email in member's collection and username + email in user's collection
  }

  return (
    <>
      {error ? <Message error header={error} /> : null}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Email</label>
          <input
            value={data.email}
            onChange={e => {
              setData({ ...data, email: e.target.value })
            }}
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value)
            }}
          />
        </Form.Field>

        <Form.Field>
          <label>Confirm Password</label>
          <input
            value={confirmPass}
            onChange={e => {
              setConfirmPass(e.target.value)
            }}
          />
        </Form.Field>

        <Form.Field
          id="form-pin"
          label="Pin"
          value={newPin}
          onChange={e => {
            setNewPin(e.target.value)
          }}
          control={Input}
        />

        <Form.Field
          label="Confirm New Pin"
          onChange={e => {
            setData({ ...data, pin: e.target.value })
          }}
          control={Input}
        />

        <Button type="submit">Submit</Button>
      </Form>
    </>
  )
}
