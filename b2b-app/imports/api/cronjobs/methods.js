import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Cronjobs from './schema'
const debug = require('debug')('target:cronjobs')

Meteor.methods({
  'rm.cronjobs': async (id) => {
    try {
      await Cronjobs.removeAsync(id)
      logger.info('Removed cronjob', { id })
      return { status: 'success', message: 'Removed cronjob' }
    } catch (e) {
      logger.error(`Error removing cronjob: ${e.message}`, { id })
      return {
        status: 'failed',
        message: `Error removing cronjob: ${e.message}`,
      }
    }
  },
  'update.cronjobs': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Cronjobs.updateAsync(id, { $set: form })
      logger.info('updated cronjob', { id, data: form })
      return { status: 'success', message: `Updated ${n} cronjob(s)` }
    } catch (e) {
      logger.error(`Error updating cronjob: ${e.message}`, { data: form })
      return {
        status: 'failed',
        message: `Error updating cronjob: ${e.message}`,
      }
    }
  },
  'insert.cronjobs': async (form) => {
    try {
      const id = await Cronjobs.insertAsync(form)
      logger.info('inserted cronjob', { data: form })
      return { status: 'success', message: 'Added cronjob' }
    } catch (e) {
      logger.error(`Error adding cronjob: ${e.message}`, { data: form })
      return {
        status: 'failed',
        message: `Error adding cronjob: ${e.message}`,
      }
    }
  },
})
