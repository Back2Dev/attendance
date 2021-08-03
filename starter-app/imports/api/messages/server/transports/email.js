import SimpleSchema from 'simpl-schema'
import logger from '/imports/lib/log'
import { getCfgs } from '/imports/api/settings/server/helper'
import Transporter from './index'
import { sendEmail } from '/imports/api/messages/email-send'

const debug = require('debug')('app:messages:email')

const ToSchema = new SimpleSchema({
  email: String,
  name: String,
  type: { type: String, optional: true },
})

const HeaderSchema = new SimpleSchema({
  'Reply-To': String,
})

const MetaDataSchema = new SimpleSchema({
  rcpt: String,
  values: { type: Object, blackbox: true },
})

export const EmailDataSchema = new SimpleSchema({
  html: String,
  text: { type: String, optional: true },
  subject: { type: String, optional: true },
  from_email: { type: String, optional: true }, // optional because it can use the system name and email
  from_name: { type: String, optional: true }, // optional because it can use the system name and email
  to: Array,
  'to.$': ToSchema,
  headers: { type: HeaderSchema, optional: true },
  important: { type: Boolean, optional: true },
  bcc_address: { type: String, optional: true },
  tags: { type: Array, optional: true },
  'tags.$': String,
  recipient_metadata: { type: Array, optional: true },
  'recipient_metadata.$': MetaDataSchema,
})

export class EmailTransport {
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
      const cfgs = getCfgs(['emailEnabled', 'emailMaxRetries'])
      debug({ cfgs })
      if (cfgs) {
        if (cfgs['emailEnabled']) {
          this.settings.enabled = cfgs['emailEnabled'] === 'true'
        }
        if (cfgs['emailMaxRetries']) {
          this.settings.maxRetries = parseInt(cfgs['emailMaxRetries'], 10)
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
    if (type !== 'email') {
      return {
        status: 'info',
        message: 'Email Transport handles email message type only',
      }
    }
    try {
      EmailDataSchema.validate(data)
    } catch (e) {
      // debug('verify error', e.message)
      return { status: 'failed', message: e.message }
    }
    return { status: 'success', message: 'email data validated' }
  }
  /**
   * Submit data (post) to email url
   * it will depend on these settings
   * - emailEnabled: enable/disable sending
   * - emailMaxRetries: max retry times
   * @param message Messages Object
   * @returns { Object } result
   * - { result.status } String: success, failed, info
   * - { result.message } String
   * - { result.exceeded } undefined or true/false
   * - { result.res } Object axios response which include
   *    - { result.res.status } String the http status
   *    - { result.res.headers } Object
   *    - { result.res.data } Object the json object (expecting)
   */
  async send(message) {
    logger.info('Attempting to send email', { to: message.to, subject: message.subject })

    if (this.settings.enabled !== true) {
      return { status: 'info', message: `Email transport method is disabled` }
    }

    const { type, data, retries } = message

    if (type !== 'email') {
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
      const response = await sendEmail(data)
      if (response && response[0].status !== 'sent') {
        return { status: 'failed', message: response[0].reject_reason }
      }
      logger.info('Successfully sent email', { response: response, data: data })
      return {
        status: 'success',
        message: 'successfully sent messages',
      }
    } catch (e) {
      logger.error('email transport error', { error: e.message, data: data })
      return { status: 'failed', message: e.message, exceeded }
    }
  }
}

const transport = new EmailTransport()

// register this transport
const result = Transporter.registerTransport('email', transport)
// debug('register transport', result)

export default transport
