// methods.js
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema'
//
// Importing the data api's makes sure collections are set up properly.
//
import CONSTANTS from '/imports/api/constants'
import log, { createLog } from '/imports/lib/log'

const debug = require('debug')('b2b:methods')

const _ = require('lodash')

/**
 * Utility function to throw a meteor error (and also echo it to the console).
 *
 * @param {string} msg - The message to go with the exception.
 */
export const myThrow = function (msg) {
  console.error(`Throwing error: ${msg}`)
  throw new Meteor.Error(msg)
}

Meteor.methods({
  showUser(email) {
    createLog({
      type: CONSTANTS.LOG_EVENT_TYPES.METHOD_CALL,
      data: {
        method: 'showUser',
        email,
      },
    })
    const user = Accounts.findUserByEmail(email)
    if (!user) {
      debug(`User not found with email ${email}`)
    } else {
      debug('user: ', user)
    }
  },

  rmUser(username) {
    if (Meteor.isClient) return
    new SimpleSchema({
      username: { type: String },
    }).validate({ username })

    try {
      Meteor.users.remove({ username })
      createLog({
        type: CONSTANTS.LOG_EVENT_TYPES.USER_DELETE,
        data: {
          username,
        },
      })
    } catch (e) {
      log.error('Error removing user', e)
      throw new Meteor.Error(e.message)
    }
  },
  testLog() {
    log.error('Something went wrong', { name: 'Blamed me' })
  },
  testAudit() {
    log.audit('This is an audit entry, should go to both logs and audit trail', {
      name: 'Audited me',
    })
  },
})
