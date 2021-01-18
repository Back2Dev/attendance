import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Header } from 'semantic-ui-react'

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  try {
    const logEvent = {
      userId: Meteor.user().username,
      type: 'user-loggedOut',
      description: `${Meteor.user().username} successfully logged out`,
      eventTime: Date.now(),
    }
    Meteor.call('insert.logs', logEvent)
    Meteor.logout()
  } catch (e) {
    console.log('error:' + e)
  }

  return (
    <Header as="h2" textAlign="center">
      <p>You are signed out.</p>
    </Header>
  )
}

export default Signout
