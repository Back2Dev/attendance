import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Profiles from './schema'

Meteor.methods({
  'rm.profiles': (id) => {
    try {
      Profiles.remove(id)
      logger.audit('Removed profile', { id })
      return { status: 'success', message: 'Removed profile' }
    } catch (e) {
      logger.error(`Error removing profile: ${e.message}`, { id })
      return { status: 'failed', message: `Error removing profile: ${e.message}` }
    }
  },
  'id.profiles': (id) => {
    return [Profiles.find(id)]
  },
  'update.profiles': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Profiles.update(id, { $set: form })
      logger.audit('Updated profile', { id, form })
      return { status: 'success', message: `Updated ${n} profile(s)` }
    } catch (e) {
      logger.error(`Error updating profile: ${e.message}`, { form })
      return { status: 'failed', message: `Error updating profile: ${e.message}` }
    }
  },
  'insert.profiles': (form) => {
    try {
      Profiles.insert(form)
      logger.audit('profile added', form)
      return { status: 'success', message: 'Added profile' }
    } catch (e) {
      logger.error(`Error adding profile: ${e.message}`, form)
      return { status: 'failed', message: `Error adding profile: ${e.message}` }
    }
  },
})
