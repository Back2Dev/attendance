import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Audits from './schema'
const debug = require('debug')('app:audits')

Meteor.methods({
  'rm.audits': async (id) => {
    try {
      await Audits.removeAsync(id)
      logger.audit('Removed audit', { id })
      return { status: 'success', message: 'Removed audit' }
    } catch (e) {
      logger.error(`Error removing audit: ${e.message}`)
      return {
        status: 'failed',
        message: `Error removing audit: ${e.message}`,
      }
    }
  },
  'update.audits': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Audits.updateAsync(id, { $set: form })
      logger.audit('Updated audits', { data: form })
      return { status: 'success', message: `Updated ${n} audit(s)` }
    } catch (e) {
      logger.error(`Error updating audit: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return {
        status: 'failed',
        message: `Error updating audit: ${e.message}`,
      }
    }
  },
  'insert.audits': async (form) => {
    try {
      await Audits.insertAsync(form)
      logger.audit('Inserted audits', { data: form })
      return { status: 'success', message: 'Added audit' }
    } catch (e) {
      logger.error(`Error adding audit: ${e.message}`, { data: form })
      return {
        status: 'failed',
        message: `Error adding audit: ${e.message}`,
      }
    }
  },
})
