import Sessions from './schema'
import Members from '/imports/api/members/schema'

Meteor.methods({
  getAllSessions() {
    if (Meteor.isClient) return null
    return Sessions.find({}).fetch()
  }
})

Meteor.startup(() => {
  Sessions.find({ memberName: { $exists: false } }).forEach(session => {
    const member = Members.findOne(session.memberId)
    Sessions.update(session._id, { $set: { memberName: member.name } })
  })
})
