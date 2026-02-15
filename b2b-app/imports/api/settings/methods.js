import { Meteor } from 'meteor/meteor'
import Settings from './schema'
const debug = require('debug')('app:settings')

Meteor.methods({
  'rm.settings': async (id) => {
    try {
      const n = await Settings.removeAsync(id)
      return { status: 'success', message: `Removed setting` }
    } catch (e) {
      return { status: 'failed', message: `Error removing setting: ${e.message}` }
    }
  },
  'update.settings': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Settings.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} setting(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating setting: ${e.message}` }
    }
  },
  'insert.settings': async (form) => {
    try {
      const id = await Settings.insertAsync(form)
      return { status: 'success', message: `Added setting` }
    } catch (e) {
      return { status: 'failed', message: `Error adding setting: ${e.message}` }
    }
  },
  'upsert.slug.settings': async (form) => {
    try {
      const rec = await Settings.findOneAsync({ slug: form.slug })
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
        await Settings.updateAsync({ _id }, { $set: form, $unset: unset })
        return { status: 'success', message: `Updated setting ${form.slug}` }
      } else {
        const id = await Settings.insertAsync(form)
        return { status: 'success', message: `Added setting ${form.slug}` }
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding setting: ${e.message}`,
      }
    }
  },
})
