import SimpleSchema from 'simpl-schema'
import { getCfgs } from '/imports/api/settings/server/helper'
import Transporter from './index'
import logger from '/imports/lib/log'
import { sendSMS } from '/imports/api/messages/sms-send'

const debug = require('debug')('app:messages:sms')

export const SMSDataSchema = new SimpleSchema({
  recipient: String,
  sender: String,
  message: String,
})

export class SMSTransport {
  /**
   * Constructor
   * @param settings the configure object
   */
  constructor(settings) {
    // default settings
    this.settings = {
      enabled: true,
      maxRetries: undefined, // undefined mean it won't handle
    }

    if (settings) {
      const { enabled, maxRetries } = settings
      if (enabled !== undefined) {
        this.settings.enabled = enabled
      }
      if (maxRetries !== undefined) {
        this.settings.maxRetries = maxRetries
      }
    } else {
      // get the config to decide which type of message is enabled
      const cfgs = getCfgs(['smsEnabled', 'smsMaxRetries'])
      debug({ cfgs })
      if (cfgs) {
        if (cfgs['smsEnabled']) {
          this.settings.enabled = cfgs['smsEnabled'] === 'true'
        }
        if (cfgs['smsMaxRetries']) {
          this.settings.maxRetries = parseInt(cfgs['smsMaxRetries'], 10)
        }
      }
      // debug('settings', this.settings)
    }
  }

  /**
   * verify data
   * @param message Messages Object
   * @returns { Object } result
   * - { result.status } String: success, failed, info
   * - { result.message } String
   */
  verify(message) {
    if (!message) {
      return { status: 'failed', message: 'Invalid message' }
    }
    const { type, data } = message
    if (type !== 'sms') {
      return {
        status: 'info',
        message: 'SMS Transport handles sms message type only',
      }
    }
    try {
      SMSDataSchema.validate(data)
    } catch (e) {
      return { status: 'failed', message: e.message }
    }
    return { status: 'success', message: '' }
  }
  /**
   * Submit data (post) to sms url
   * it will depend on these settings
   * - smsEnabled: enable/disable sending
   * - smsMaxRetries: max retry times
   * @param message Messages Object
   * @returns { Object } result
   * - { result.status } String:  success, failed, info
   * - { result.message } String
   * - { result.exceeded } undefined or true/false
   * - { result.res } Object axios response which include
   *    - { result.res.status } String the http status
   *    - { result.res.headers } Object
   *    - { result.res.data } Object the json object (expecting)
   */
  async send(message) {
    logger.info('attempting to send sms', { to: message.to, subject: message.subject })
    // debug('send settings', this.settings)
    if (this.settings.enabled !== true) {
      return { status: 'info', message: `SMS transport method is disabled` }
    }
    const { type, data, retries } = message

    if (type !== 'sms') {
      return { status: 'info', message: `message type ${type} is not supported` }
    }

    let exceeded
    if (this.settings.maxRetries) {
      exceeded = this.settings.maxRetries <= retries
    }

    const verifyResult = this.verify(message)
    if (verifyResult.status !== 'success') {
      return {
        status: 'failed',
        message: verifyResult.message,
        exceeded,
      }
    }

    // send the data
    try {
      const response = await sendSMS(data)
      // logger.info('Successfully sent sms', { response: response, data: data })
      logger.audit(`Sent sms to ${data.recipient}`, message)
      return {
        status: 'success',
        message: 'successfully sent messages',
      }
    } catch (e) {
      logger.error('sms transport error', { error: e.message, data: data, exceeded })
      return { status: 'failed', message: e.message, exceeded }
    }
  }
}

const transport = new SMSTransport()

// register this transport
const result = Transporter.registerTransport('sms', transport)
// debug('register transport', result)

export default transport
