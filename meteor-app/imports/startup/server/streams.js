import { Meteor } from 'meteor/meteor'

export default setupStreams = () => {
  const streamer = new Meteor.Streamer('chat')

  if (Meteor.isServer) {
    streamer.allowRead('all')
    streamer.allowWrite('all')
    streamer.on('message', function (message) {
      console.log('user: ', message)
    })
    streamer.emit('message', 'messages from server')
  }

  Meteor.methods({
    msg(thing) {
      streamer.emit('message', thing)
    },
  })
}
