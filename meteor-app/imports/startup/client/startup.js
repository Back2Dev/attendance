import React from 'react'
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import App from '/imports/ui/layouts/app'

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  render(<App />, document.getElementById('app')) // eslint-disable-line
})
