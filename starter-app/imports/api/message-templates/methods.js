import logger from '/imports/lib/log'
import { Meteor } from 'meteor/meteor'
import MessageTemplates from './schema'

Meteor.methods({
  'rm.messageTemplates': (id) => {
    try {
      MessageTemplates.remove(id)
      logger.info('Removed message template', { id })
      return { status: 'success', message: 'Removed messagetemplate' }
    } catch (e) {
      logger.error(`Error removing messagetemplate: ${e.message}`)
      return {
        status: 'failed',
        message: `Error removing messagetemplate: ${e.message}`,
      }
    }
  },

  'update.messageTemplates': (form) => {
    try {
      const id = form._id
      delete form._id
      form.revision = form.revision ? form.revision + 1 : 1
      const n = MessageTemplates.update(id, { $set: form })
      logger.info(`Updated message template ${id}`, form)
      return { status: 'success', message: `Updated ${n} messagetemplate(s)` }
    } catch (e) {
      logger.error(`Error updating messagetemplate: ${e.message}`)
      return {
        status: 'failed',
        message: `Error updating messagetemplate: ${e.message}`,
      }
    }
  },
  'insert.messageTemplates': (form) => {
    try {
      MessageTemplates.insert(form)
      logger.info('Inserted new message template', form)
      return { status: 'success', message: 'Added messagetemplate' }
    } catch (e) {
      logger.error(`Error adding messagetemplate: ${e.message}`)
      return {
        status: 'failed',
        message: `Error adding messagetemplate: ${e.message}`,
      }
    }
  },
})
