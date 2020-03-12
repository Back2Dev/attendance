import React from 'react'
import { Form, Input, Message } from 'semantic-ui-react'

export default UserDetailForm = ({ formData, setUser }) => {
  const [password, setPassword] = React.useState('')
  const [newPin, setNewPin] = React.useState(formData.pin)
  const [data, setData] = React.useState(formData)
  const [error, setError] = React.useState(null)

  const handleSubmit = (e, h) => {
    setError(null)
    if (data.pin.length !== 4) {
      return setError('Pin number must be 4 digits')
    } else if (newPin !== data.pin) {
      return setError('Pin does not match')
    }
    setUser(data)
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
              setData({ ...formData, email: e.target.value })
            }}
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
        </Form.Field>

        <Form.Field>
          <label>Confirm Password</label>
          <input />
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
            setData({ ...formData, pin: e.target.value })
          }}
          control={Input}
        />

        <button type="submit">Submit Changes</button>
      </Form>
    </>
  )
}
