import React from 'react'
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import App from '/imports/ui/layouts/app'

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  setupStreamer() // Experimental for now
  render(<App />, document.getElementById('app')) // eslint-disable-line
})

const setupStreamer = () => {
  const streamer = new Meteor.Streamer('chat')

  if (Meteor.isClient) {
    sendMessage = function (message) {
      streamer.emit('message', message)
      // console.log('me: ' + message)
    }

    streamer.on('message', function (message) {
      // console.log('user: ', message)
    })
    streamer.emit('message', 'message from client')
    streamer.emit('message', { a: 'message from client' })
  }
}
