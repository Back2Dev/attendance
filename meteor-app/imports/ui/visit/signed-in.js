import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header, Input } from 'semantic-ui-react'

const EmailMobile = props => {
  const { email, mobile } = props.member
  const [form, setForm] = React.useState({ mobile, email })
  const save = () => {}
  const onChangeInput = (e, data) => {
    const newForm = form
    newForm[e.target.name] = e.target.value
  }
  return (
    <div>
      <Form onSubmit={save}>
        <Form.Field>
          <label htmlFor="mobile">Your mobile number:</label>
          <Input defaultValue={mobile} name="mobile" id="mobile" focus onChange={onChangeInput} />
        </Form.Field>
        <Form.Field>
          <label htmlFor="email">Your email</label>
          <Input defaultValue={email} name="email" id="emai" onChange={onChangeInput} />
        </Form.Field>
        <Button type="submit" id="update" color="green" fluid>
          Save
        </Button>
      </Form>
    </div>
  )
}

const Arrive = props => {
  const [showEdit, setShow] = React.useState(false)
  const toggleEdit = e => {
    setShow(!showEdit)
  }
  const needMore = !props.member.email || !props.member.mobile
  const but = needMore ? ", but your profile isn't complete" : ''
  return (
    <div style={{ padding: '20px 0' }}>
      <div>
        <Header as="h3">You are now signed in{but}</Header>
        {needMore && showEdit && <EmailMobile {...props} />}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button onClick={toggleEdit}>Enter email/mobile only</Button>
          <Button onClick={() => props.history.push(`/edit/${props.member._id}`)}>Edit Your Profile</Button>
          <Button onClick={() => props.history.push(`/`)}>Not now</Button>
        </div>
      </div>

      {/* <Button onClick={() => props.history.push(`/`)} positive fluid id="done" size="large">
        Done
      </Button> */}
    </div>
  )
}

Arrive.propTypes = {}

export default Arrive
