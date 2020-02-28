import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'

import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const Signup = location => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)

  submit = () => {
    Meteor.call('addNewMemberUser', email, password, function(error, result) {
      if (result === 'success') {
        location.history.goBack()
      } else {
        setError(result)
      }
    })
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
                  onChange={e => setEmail(e.target.value)}
                />
                <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
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
