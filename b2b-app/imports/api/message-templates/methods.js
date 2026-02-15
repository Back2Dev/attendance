import logger from '/imports/lib/log'
import { Meteor } from 'meteor/meteor'
import MessageTemplates from './schema'

Meteor.methods({
  'rm.messageTemplates': async (id) => {
    try {
      await MessageTemplates.removeAsync(id)
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

  'update.messageTemplates': async (form) => {
    try {
      const id = form._id
      delete form._id
      form.revision = form.revision ? form.revision + 1 : 1
      const n = await MessageTemplates.updateAsync(id, { $set: form })
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
  'insert.messageTemplates': async (form) => {
    try {
      await MessageTemplates.insertAsync(form)
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
  'upsert.slug.message-templates': async (form, unsetMissing = true) => {
    try {
      debug(`Upserting message-template: ${form.slug}`)
      const rec = await MessageTemplates.findOneAsync({ slug: form.slug })
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        if (unsetMissing)
          Object.keys(rec)
            .filter((key) => !key.match(/_id|At|By$/))
            .forEach((key) => {
              if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
            })
        await MessageTemplates.updateAsync({ _id }, { $set: form, $unset: unset })
        return { status: 'success', message: `Updated message-template ${form.slug}` }
      } else {
        if (!form.name) form.name = form.slug || 'Untitled'
        const id = await MessageTemplates.insertAsync(form)
        return { status: 'success', message: `Added message-template ${form.slug}` }
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding message-template: ${e.message}`,
      }
    }
  },
})
