import logger from '/imports/lib/log'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Messages from './schema'
import { sendMessages } from './functions'

import Transporter from './server/transports'
// import all transporters here
require('./server/transports/webhook')
require('./server/transports/sms')
require('./server/transports/email')

Meteor.methods({
  'rm.messages': (id) => {
    try {
      logger.info(`Removed message with ${id}`)
      Messages.remove(id)
      return { status: 'success', message: 'Removed message' }
    } catch (e) {
      logger.error(`Error when removing message: ${e.message}`)
      return {
        status: 'failed',
        message: `Error removing message: ${e.message}`,
      }
    }
  },
  'update.messages': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Messages.update(id, { $set: form })
      logger.audit(`Updated ${n} messages`, form)
      return { status: 'success', message: `Updated ${n} message(s)` }
    } catch (e) {
      logger.error(`Error when updating message: ${e.message}`)
      return {
        status: 'failed',
        message: `Error updating message: ${e.message}`,
      }
    }
  },
  /**
   * Insert a message to messages collection
   * @param form Object matched the message schema
   * @returns Object which has
   * - { status } String - success or failed
   * - { message } String - success or error message
   * - { id } String inserted message id (if status is success)
   */
  'insert.messages': (form) => {
    check(form, Object)
    // try to verify with data transports
    const verifyResult = Transporter.verify(form)
    if (verifyResult.status === 'failed') {
      logger.error(`Failed to verify results: ${verifyResult.message}`, form)
      return {
        status: 'failed',
        message: verifyResult.message,
      }
    }
    try {
      const id = Messages.insert(form)
      logger.audit('successfuly inserted new message', { id })
      return { status: 'success', message: 'Added message', id }
    } catch (e) {
      logger.error(`Failed to add new message: ${e.message}`, form)
      return {
        status: 'failed',
        message: `Error adding message: ${e.message}`,
      }
    }
  },
  /**
   * cronjob call this method periodically
   * it will depend on these settings
   * - messages_enabled: global enable/disable sending
   * - messages_maxRetries: global max retry times
   * @returns Object
   * - { status } String - success or failed
   * - { message } String
   * - { successIds } Array of message id which are sent successfully
   * - { failureIds } Array of message id which are sent faulty
   */
  async 'send.messages'(type) {
    const messages = await sendMessages(type)
    return messages
  },
  /**
   * Stop sending a message, mark its status cancelled
   * @param id String - message id
   * @returns Object which has
   * - { status } String - success or failed
   * - { message } String - success or error message
   */
  'cancel.messages'(id) {
    check(id, String)
    try {
      const n = Messages.update(
        { _id: id },
        {
          $set: {
            status: 'cancelled',
            updatedAt: new Date(),
          },
          $push: {
            history: {
              message: 'Cancelled',
              createdAt: new Date(),
            },
          },
        }
      )
      if (!n) {
        logger.error(`Unable to update message with id ${id}`)
        return { status: 'failed', message: `Unable to update message with id ${id}` }
      }
      logger.audit('Message cancelled', { id })
      return { status: 'success', message: 'Cancelled message' }
    } catch (e) {
      logger.error(`Error cancelling message: ${e.message}`, { id: id })
      return {
        status: 'failed',
        message: `Error cancelling message: ${e.message}`,
      }
    }
  },
})
