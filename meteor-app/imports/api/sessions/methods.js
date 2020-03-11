import Sessions from './schema'
import Members from '/imports/api/members/schema'

const debug = require('debug')('target:sessions')

Meteor.methods({
  getAllSessions() {
    if (Meteor.isClient) return null
    return Sessions.find({}).fetch()
  },
  'rm.sessions': id => {
    try {
      const n = Sessions.remove(id)
      return { status: 'success', message: `Removed session` }
    } catch (e) {
      return { status: 'failed', message: `Error removing session: ${e.message}` }
    }
  },
  'update.sessions': form => {
    try {
      const id = form._id
      delete form._id
      const n = Sessions.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} session(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating session: ${e.message}` }
    }
  },
  'add.sessions': form => {
    try {
      const id = Sessions.insert(form)
      return { status: 'success', message: `Added session` }
    } catch (e) {
      return { status: 'failed', message: `Error adding session: ${e.message}` }
    }
  }

})

Meteor.startup(() => {
  Sessions.find({ memberName: { $exists: false } }).forEach(session => {
    const member = Members.findOne(session.memberId)
    if (member)
      Sessions.update(session._id, { $set: { memberName: member.name } })
  })
})

