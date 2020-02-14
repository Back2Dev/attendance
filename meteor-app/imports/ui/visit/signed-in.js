import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header, Input } from 'semantic-ui-react'
import context from '/imports/ui/utils/nav'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'

const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i

const EmailMobile = props => {
  const { email = '', mobile = '' } = props.member
  const [form, setForm] = React.useState({ mobile, email })
  const [disabled, setDisabled] = React.useState(true)
  const save = () => {
    props.save(props.member._id, form)
  }

  const onChangeInput = (e, data) => {
    const newForm = form
    newForm[e.target.name] = e.target.value
    setForm(newForm)
    const emailValid = emailRegex.test(form.email)
    setDisabled(form.mobile.length < 8 || form.email.length < 6 || !emailValid)
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
        <Button
          type="submit"
          id="update"
          disabled={disabled}
          color="green"
          size="large"
          fluid
          style={{ marginBottom: '24px' }}
        >
          Save
        </Button>
      </Form>
    </div>
  )
}

const Arrive = props => {
  const [showEdit, setShow] = React.useState(false)
  const needMore = !props.member.email || !props.member.mobile
  React.useEffect(() => {
    const needMore = !props.member.email || !props.member.mobile
    if (!needMore) {
      const timer = setTimeout(() => {
        props.history.push(context.goHome())
      }, 5000)
      return function cleanup() {
        clearTimeout(timer)
      }
    }
  }),
    []
  const toggleEdit = e => {
    setShow(!showEdit)
  }
  const but = needMore ? ", but your profile isn't complete" : ''

  return (
    <div style={{ padding: '20px 0', textAlign: 'center' }}>
      <div>
        <Header as="h3">You are now signed in{but}</Header>
        {needMore && <EmailMobile {...props} />}
        <div>Member Type: {props.member.subsType}</div>
        {props.member.subsType === 'pass' && props.purchase && (
          <MultiVisitsCard
            usedVisits={props.purchase.sessions.length}
            totalVisits={props.purchase.sessions.length + props.purchase.remaining}
          />
        )}
        {!props.purchase.sessions.length && 'You have used all your sessions for your previous pass'}
        &nbsp;
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {props.purchase && props.purchase.paymentStatus === 'unpaid' && (
            <Button color="red" onClick={() => props.history.push(`/shop/renew/${props.member._id}/${props.cart._id}`)}>
              Pay Now
            </Button>
          )}
          {needMore && (
            <Button type="button" id="done" onClick={() => props.history.push(`/kiosk`)}>
              Not now
            </Button>
          )}
          {!needMore && (
            <Button id="done" type="button" onClick={() => props.history.push(`/kiosk`)} color="orange">
              I'm done now
            </Button>
          )}
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
