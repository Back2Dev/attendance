import { result } from 'lodash'

const debug = require('debug')('app:messages:transporter')

class Transporter {
  constructor() {
    this.transports = {}
  }
  /**
   * Register a transport type
   * @param type String transport type
   * @param transport The transport instance
   * @returns Object
   * - { status } String: success, failed
   * - { message } String
   */
  registerTransport(type, transport) {
    if (typeof type !== 'string') {
      return { status: 'failed', message: 'invalid transport type' }
    }
    if (!transport || typeof transport !== 'object') {
      return { status: 'failed', message: 'invalid transport instance' }
    }
    if (typeof transport.verify !== 'function') {
      return { status: 'failed', message: 'invalid verify function' }
    }
    if (typeof transport.send !== 'function') {
      return { status: 'failed', message: 'invalid send function' }
    }

    this.transports[type] = transport
    return {
      status: 'success',
      message: `Transport type ${type} registered successfully`,
    }
  }
  /**
   * verify the data
   * @param message Object Messages
   * @returns Object
   * - { status } String: success, failed, info
   * - { message } String
   */
  verify(message) {
    if (!message || !message.type) {
      return {
        status: 'failed',
        message: `Invalid message`,
      }
    }
    if (!this.transports || !this.transports.hasOwnProperty(message.type)) {
      return {
        status: 'info',
        message: `No transport handled message type: ${message.type}`,
      }
    }
    try {
      const result = this.transports[message.type].verify(message)
      if (!result) {
        return {
          status: 'failed',
          message: `${message.type}: failed`,
        }
      }
      return { status: result.status || 'failed', message: result.message || '' }
    } catch (e) {
      return {
        status: 'failed',
        message: e.message,
      }
    }
  }
  /**
   * send the data
   * @param message Object Messages
   * @returns Object
   * - { status } String: success, failed, info
   * - { message } String
   */
  async send(message) {
    if (!message || !message.type) {
      return {
        status: 'failed',
        message: `Invalid message`,
      }
    }
    if (!this.transports || !this.transports.hasOwnProperty(message.type)) {
      return {
        status: 'info',
        message: `No transport handled message type: ${message.type}`,
      }
    }
    try {
      const result = await this.transports[message.type].send(message)
      if (!result) {
        return {
          status: 'failed',
          message: `${message.type}: failed`,
        }
      }
      return { status: result.status || 'failed', message: result.message || '' }
    } catch (e) {
      return {
        status: 'failed',
        message: e.message,
      }
    }
  }
}

export default new Transporter()
