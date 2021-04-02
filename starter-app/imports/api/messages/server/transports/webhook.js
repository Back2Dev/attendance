import axios from 'axios'

import SimpleSchema from 'simpl-schema'
import { RegExId } from '/imports/api/utils/schema-util'
import { getCfgs } from '/imports/api/settings/server/helper'
import Transporter from './index'
import logger from '/imports/lib/log'

const debug = require('debug')('b2b:messages:webhooks')

export const WebhookDataSchema = new SimpleSchema({
  webhookId: RegExId,
  webhookURL: String,
  payload: {
    type: Object,
    blackbox: true,
  },
})

export class WebhookTransport {
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
      const cfgs = getCfgs(['messages_webhook_enabled', 'messages_webhook_maxRetries'])
      // debug({ cfgs })
      if (cfgs) {
        if (cfgs['messages_webhook_enabled']) {
          this.settings.enabled = cfgs['messages_webhook_enabled'] === 'true'
        }
        if (cfgs['messages_webhook_maxRetries']) {
          this.settings.maxRetries = parseInt(cfgs['messages_webhook_maxRetries'], 10)
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
    if (type !== 'webhook') {
      return {
        status: 'info',
        message: 'Webhook Transport handles webhook message type only',
      }
    }
    try {
      WebhookDataSchema.validate(data)
    } catch (e) {
      // debug('verify error', e.message)
      return { status: 'failed', message: e.message }
    }
    return { status: 'success', message: '' }
  }
  /**
   * Submit data (post) to webhook url
   * it will depend on these settings
   * - messages_webhook_enabled: enable/disable sending
   * - messages_webhook_maxRetries: max retry times
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
    logger.info('sending webhook...', message)
    // debug('send settings', this.settings)

    if (this.settings.enabled !== true) {
      return { status: 'info', message: `Webhook transport method is disabled` }
    }

    const { type, data, retries } = message

    if (type !== 'webhook') {
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
    const { webhookId, webhookURL, payload } = data
    try {
      const { status, headers, data } = await axios.post(webhookURL, payload, {
        validateStatus: () => true,
      })
      debug({ webhookURL, status, headers, data })
      logger.info('Webhook sent', {
        res: {
          status,
          headers,
          data,
        },
      })
      return {
        status: status === 200 ? 'success' : 'failed',
        message: status === 200 ? '' : `Webhook returns invalid http code: ${status}`,
        exceeded,
        res: {
          status,
          headers,
          data,
        },
      }
    } catch (e) {
      logger.warn('webhook failed', { error: e.message })
      debug('axios error', e.message)
      return { status: 'failed', message: e.message, exceeded }
    }
  }
}

const transport = new WebhookTransport()

// register this transport
const result = Transporter.registerTransport('webhook', transport)
// debug('register transport', result)

export default transport
