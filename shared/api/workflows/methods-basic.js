import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import logger from '/imports/lib/log'
import Workflows from '/imports/api/workflows/schema'
import { checkWorkflowPermission } from './utils'
const debug = require('debug')('app:workflows')

Meteor.methods({
  'rm.workflows': async (id) => {
    try {
      check(id, String)
      await checkWorkflowPermission()
      await Workflows.removeAsync(id)
      logger.info('Removed workflow', { id })
      return { status: 'success', message: 'Removed workflow' }
    } catch (e) {
      logger.error(`Error removing workflow: ${e.message}`, {
        message: e.message,
        id: id,
      })
      return { status: 'failed', message: `Error removing workflow: ${e.message}` }
    }
  },
  'update.workflows': async (form) => {
    try {
      check(form._id, String)
      check(form.version, Number)
      check(form.name, String)
      check(form.slug, String)
      await checkWorkflowPermission()
      const id = form._id
      delete form._id
      if (form.version) {
        form.version = parseInt(form.version) + 1
      }
      const n = await Workflows.updateAsync(id, { $set: form })
      const { name, slug } = form
      logger.info('Updated workflows', { name, slug })
      return { status: 'success', message: `Updated ${n} workflow(s)` }
    } catch (e) {
      logger.error(`Error updating workflow: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return { status: 'failed', message: `Error updating workflow: ${e.message}` }
    }
  },
  'insert.workflows': async (form) => {
    try {
      check(form, Object)
      await checkWorkflowPermission()
      await Workflows.insertAsync(form)
      logger.info('Inserted workflow', form)
      return { status: 'success', message: 'Added workflow' }
    } catch (e) {
      logger.error(`Error adding workflow: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return { status: 'failed', message: `Error adding workflow: ${e.message}` }
    }
  },
  'upsert.slug.workflows': async (form) => {
    try {
      const rec = await Workflows.findOneAsync({ slug: form.slug })
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        Object.keys(rec)
          .filter((key) => !key.match(/_id|At|By$/))
          .forEach((key) => {
            if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
          })
        await Workflows.updateAsync({ _id }, { $set: form, $unset: unset })
        return { status: 'success', message: `Updated workflow ${form.slug}` }
      } else {
        const id = await Workflows.insertAsync(form)
        return { status: 'success', message: `Added workflow ${form.slug}` }
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding workflow: ${e.message}`,
      }
    }
  },
})
