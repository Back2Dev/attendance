import Sessions from './schema'

Meteor.methods({
  getAllSessions() {
    if (Meteor.isClient) return null
    return Sessions.find({}).fetch()
  }
})