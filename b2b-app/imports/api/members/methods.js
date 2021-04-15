import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Members from './schema'

Meteor.methods({
  'rm.members': (id) => {
    try {
      Members.remove(id)
      logger.audit('Removed member', { id })
      return { status: 'success', message: 'Removed member' }
    } catch (e) {
      logger.error(`Error removing member: ${e.message}`, { id })
      return { status: 'failed', message: `Error removing member: ${e.message}` }
    }
  },
  'id.members': (id) => {
    return [Members.find(id)]
  },
  'update.members': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Members.update(id, { $set: form })
      logger.audit('Updated member', { id, form })
      return { status: 'success', message: `Updated ${n} member(s)` }
    } catch (e) {
      logger.error(`Error updating member: ${e.message}`, { form })
      return { status: 'failed', message: `Error updating member: ${e.message}` }
    }
  },
  'insert.members': (form) => {
    try {
      Members.insert(form)
      logger.audit('member added', form)
      return { status: 'success', message: 'Added member' }
    } catch (e) {
      logger.error(`Error adding member: ${e.message}`, form)
      return { status: 'failed', message: `Error adding member: ${e.message}` }
    }
  },
})
