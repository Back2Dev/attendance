import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const Signup = props => {
  const [email, setEmail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)
  const [pin, setPin] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [existingUsers, setExistingUsers] = useState(null)

  useEffect(() => {
    console.log(props)
    if (props.member.email) {
      setEmail(props.member.email)
      setIsLoading(false)
    }
  }, [props])

  submit = e => {
    e.preventDefault()
    // console.log(props.member.email)
    if (pin !== props.member.pin) {
      return setError('Pin is incorrect.. please try again')
    } else if (password !== confirmPassword) {
      return setError('Your password does not match')
    }

    const memberId = props.member._id

    Meteor.call('addNewMemberUser', email, password, memberId, function(error, result) {
      if (result === 'success') {
        props.history.goBack()
      } else {
        setError(result)
      }
    })
  }
  if (isLoading) {
    return <div>Loading..</div>
  } else if (props.existUser) {
    return (
      <div>
        <h1>User Already Exists.. Please Sign In</h1>
      </div>
    )
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
                  // onChange={e => setEmail(props.member.email)}
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
                  name="confirmation"
                  placeholder="Please confirm your password"
                  type="password"
                  onChange={e => setConfirmPassword(e.target.value)}
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
  location: PropTypes.object
}

export default withRouter(Signup)
