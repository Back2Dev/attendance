import { expect } from 'chai'

import Transporter from './index.js'

const debug = require('debug')('app:transport:transporter:test')

const goodTransports = {
  some_good_transport_type_1: {
    verify: () => {
      return { status: 'success', message: '' }
    },
    send: () => {
      return { status: 'success', message: '' }
    },
  },
}

const badTransports = {
  some_bad_transport_type_1: {
    verify: () => {
      return { status: 'success', message: '' }
    },
  },
}

const goodMessages = [
  {
    type: 'webhook',
    from: 'SE-admin',
    to: '4j4xvusMLDcpQfwzq',
    subject: 'settlement-completed',
    body: 'another string?',
    data: {
      webhookId: '4j4xvusMLDcpQfwzq',
      webhookURL: 'http://localhost:8080/webhooks/echo',
      payload: {
        eventType: 'settlement-completed',
        key: 'webhookItem key',
        externalId: 'the externalId',
        settlementDate: new Date(),
      },
    },
  },
]
const badMessages = [
  {
    type: 'webhook',
    from: 'SE-admin',
    to: '4j4xvusMLDcpQfwzq',
    subject: 'settlement-completed',
    body: 'another string?',
    data: {
      // webhookId: '4j4xvusMLDcpQfwzq',
      // webhookURL: 'http://localhost:8080/webhooks/echo',
      payload: {
        eventType: 'settlement-completed',
        key: 'webhookItem key',
        externalId: 'the externalId',
        settlementDate: new Date(),
      },
    },
  },
]

describe('Test Transporter', () => {
  describe('Register Transport', () => {
    it(`registerTransport() should return object with status is success with good transports`, () => {
      Object.keys(goodTransports).map((type) => {
        const result = Transporter.registerTransport(type, goodTransports[type])
        expect(result).to.be.a('object')
        expect(result.status).equal('success')
      })
    })
    it(`registerTransport() should return object with status is not success with bad transports`, () => {
      Object.keys(badTransports).map((type) => {
        const result = Transporter.registerTransport(type, badTransports[type])
        expect(result).to.be.a('object')
        expect(result.status).not.equal('success')
      })
    })
  })
  describe('Transporters verify message', () => {
    it(`verify() should return object with status is success with good messages`, () => {
      goodMessages.map((message) => {
        const result = Transporter.verify(message)
        expect(result).to.be.a('object')
        expect(result.status).equal('success')
      })
    })
    it(`verify() should return object with status is not success with bad messages`, () => {
      badMessages.map((message) => {
        const result = Transporter.verify(message)
        // debug('verify bad message', message, result)
        expect(result).to.be.a('object')
        expect(result.status).not.equal('success')
      })
    })
  })
  describe('Send message', () => {
    it(`send() should not throw`, () => {
      goodMessages.map((message) => {
        expect(() => Transporter.send(message)).to.not.throw()
      })
    })
  })
})
