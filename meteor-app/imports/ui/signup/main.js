import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const Signup = props => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)
  const [pin, setPin] = useState(null)
  const [passwordConfirm, setPasswordConfirm] = useState(null)

  useEffect(() => {
    if (props.member.email) {
      setEmail(props.member.email)
    }
  }, [props])

  submit = e => {
    e.preventDefault()
    if (pin !== props.member.pin) {
      return setError('Pin is incorrect.. please try again')
    } else if (password !== passwordConfirm) {
      return setError('Your password does not match')
    }

    props.add({ email, password })
  }
  return (
    <div>
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              Register your account
            </Header>
            <Form onSubmit={submit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  value={email}
                  disabled
                />
                <Form.Input
                  label="Enter your pin"
                  icon="lock"
                  iconPosition="left"
                  name="pin"
                  placeholder="Pin Number"
                  type="password"
                  onChange={e => setPin(e.target.value)}
                ></Form.Input>
                <Form.Input
                  label="Set A New Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
                <Form.Input
                  label="Confirm your password"
                  icon="lock"
                  iconPosition="left"
                  name="passwordConfirm"
                  placeholder="Please confirm your password"
                  type="password"
                  onChange={e => setPasswordConfirm(e.target.value)}
                />
                <Form.Button content="Submit" />
              </Segment>
            </Form>
            <Message>
              Already have an account? Login <Link to="/login">here</Link>
            </Message>
            {error === null ? null : <Message error header="Registration was not successful" content={error} />}
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  )
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  add: PropTypes.func.isRequired
}

export default withRouter(Signup)
