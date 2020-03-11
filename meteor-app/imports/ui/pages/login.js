import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

/**
 * Login page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default Login = props => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  /** Handle Login submission using Meteor's account mechanism. */
  submit = () => {
    Meteor.loginWithPassword(email, password, err => {
      if (err) {
        setError(err.reason)
      } else {
        setError('')
        props.history.push('/member-portal')
      }
    })
  }

  /** Render the login form. */
  return (
    <Container>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Login to your account
          </Header>
          <Form onSubmit={this.submit}>
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

          {error === '' ? '' : <Message error header="Login was not successful" content={error} />}
        </Grid.Column>
      </Grid>
    </Container>
  )
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Login.propTypes = {
  location: PropTypes.object
}
