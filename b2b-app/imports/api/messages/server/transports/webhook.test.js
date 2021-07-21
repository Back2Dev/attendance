import { expect } from 'chai'

import transport, { WebhookTransport } from './webhook'

const debug = require('debug')('app:messages:webhook:test')

const goodMessages = [
  {
    type: 'webhook',
    data: {
      webhookId: '4j4xvusMLDcpQfwzq',
      webhookURL: 'http://localhost:8080/webhooks/echo',
      payload: {
        somefield: 'some data',
      },
    },
  },
]
const badMessages = [
  {
    type: 'not the webhook',
    data: {},
  },
  {
    type: 'webhook',
  },
  {
    type: 'webhook',
    data: 'some data',
  },
]
const badSendingMessages = [
  {
    type: 'webhook',
    from: 'SE-admin',
    to: 'some_webhook_id',
    subject: 'settlement-completed',
    body: '500 in http return header',
    data: {
      webhookId: '4j4xvusMLDcpQfzzz',
      webhookURL: 'http://localhost:8080/webhooks/status/500',
      payload: {
        eventType: 'settlement-completed',
        key: 'webhookItem key',
        externalId: 'the externalId',
        settlementDate: new Date(),
      },
    },
    retries: 1,
  },
]

describe('Test webhook Transport', () => {
  it(`verify() should return object with status is success with good message`, () => {
    goodMessages.map((message) => {
      const result = transport.verify(message)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
    })
  })
  it(`verify() should return object with status is not success and error message with bad data`, () => {
    badMessages.map((message) => {
      const result = transport.verify(message)
      expect(result).to.be.a('object')
      expect(result.status).not.equal('success')
    })
  })
  it(`send() should return object with status is success`, async () => {
    goodMessages.map(async (message) => {
      const result = await transport.send(message)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
    })
  })
  it(`send() should return object with status is not success and message`, async () => {
    badMessages.map(async (message) => {
      const result = await transport.send(message)
      expect(result).to.be.a('object')
      expect(result.status).not.equal('success')
      expect(result.message).to.be.a('string')
    })
  })
  it(`send() should not work when it's not enabled`, async () => {
    const disabledTransport = new WebhookTransport({ enabled: false })

    badSendingMessages.map(async (message) => {
      const result = await disabledTransport.send(message)
      // debug('bad sending result', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('info')
    })
  })
  it(`send() should not work with bad webhook url (not a 200 HTTP code)`, async () => {
    badSendingMessages.map(async (message) => {
      const result = await transport.send(message)
      // debug('bad sending result', result)
      expect(result).to.be.a('object')
      expect(result.status).not.equal('success')
      expect(result.res).to.be.a('object')
      expect(result.res.status).not.equal(200)
    })
  })
  it(`send() should not work (not 200 HTTP code) and mark as exceeded`, async () => {
    const tryOnceTransport = new WebhookTransport({ enabled: true, maxRetries: 1 })

    badSendingMessages.map(async (message) => {
      const result = await tryOnceTransport.send(message)
      // debug('bad sending result', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('failed')
      expect(result.exceeded).equal(true)
    })
  })
})
