import React from 'react'
import { Form, Input, Message } from 'semantic-ui-react'

export default UserDetailForm = props => {
  const [email, setEmail] = React.useState(props.formData.email)
  const [newPin, setNewPin] = React.useState(props.formData.pin)
  const [matchPin, setMatchPin] = React.useState(null)
  const [error, setError] = React.useState(null)

  const handleSubmit = (e, h) => {
    setError(null)
    if (newPin.length !== 4) {
      return setError('Pin number must be 4 digits')
    } else if (newPin !== matchPin) {
      return setError('Pin does not match')
    }
    console.log(newPin)

    // When updating email: Update email in member's collection and username + email in user's collection
  }

  return (
    <>
      {error ? <Message error header={error} /> : null}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Email</label>
          <input
            value={email}
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input />
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
            setMatchPin(e.target.value)
          }}
          control={Input}
        />

        <button type="submit">Submit Changes</button>
      </Form>
    </>
  )
}
