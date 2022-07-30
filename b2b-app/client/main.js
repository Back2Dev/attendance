import { Meteor } from 'meteor/meteor'

import { render } from 'react-dom'
import React from 'react'

import App from '/imports/ui/app'

const Bpp = () => {
  return <h1>Hello world</h1>
}
Meteor.startup(() => {
  render(<App />, document.getElementById('root'))
})
