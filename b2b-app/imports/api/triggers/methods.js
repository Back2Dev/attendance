import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import Triggers from './schema'
import CONSTANTS from '/imports/api/constants'
import log, { createLog } from '/imports/lib/log'
import MessageTemplates from '/imports/api/message-templates/schema'
import { convertMergeTags, convertLink } from '/imports/api/util.js'
import { push } from '/imports/api/notifications/server/helper.js'
import HTMLTemplate from '/imports/api/email-template'

const debug = require('debug')('target:triggers')

Meteor.methods({
  'rm.triggers': (id) => {
    try {
      const n = Triggers.remove(id)
      return { status: 'success', message: 'Removed trigger' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing trigger: ${e.message}`,
      }
    }
  },
  'update.triggers': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Triggers.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} trigger(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating trigger: ${e.message}`,
      }
    }
  },
  'insert.triggers': (form) => {
    try {
      const id = Triggers.insert(form)
      return { status: 'success', message: 'Added trigger' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding trigger: ${e.message}`,
      }
    }
  },
})
