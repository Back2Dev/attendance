import '/imports/startup/client/startup'

const streamer = new Meteor.Streamer('chat')

if (Meteor.isClient) {
  sendMessage = function (message) {
    streamer.emit('message', message)
    console.log('me: ' + message)
  }

  streamer.on('message', function (message) {
    console.log('user: ', message)
  })
  streamer.emit('message', 'message from client')
  streamer.emit('message', { a: 'message from client' })
}
