import Sessions from './schema'
import Members from '/imports/api/members/schema'

const debug = require('debug')('target:sessions')

Meteor.methods({
  getAllSessions: async function () {
    if (Meteor.isClient) return null
    return await Sessions.find({}).fetchAsync()
  },
  'rm.sessions': async (id) => {
    try {
      const n = await Sessions.removeAsync(id)
      return { status: 'success', message: `Removed session` }
    } catch (e) {
      return { status: 'failed', message: `Error removing session: ${e.message}` }
    }
  },
  'update.sessions': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Sessions.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} session(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating session: ${e.message}` }
    }
  },
  'add.sessions': async (form) => {
    try {
      const id = await Sessions.insertAsync(form)
      return { status: 'success', message: `Added session` }
    } catch (e) {
      return { status: 'failed', message: `Error adding session: ${e.message}` }
    }
  }

})

Meteor.startup(async () => {
  for (const session of await Sessions.find({ memberName: { $exists: false } }).fetchAsync()) {
    const member = await Members.findOneAsync(session.memberId)
    if (member)
      await Sessions.updateAsync(session._id, { $set: { memberName: member.name } })
  }
})
