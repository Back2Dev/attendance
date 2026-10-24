import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { insertSettings } from '/imports/api/settings/server/helper'
import { createTestTemplates } from '/imports/test/factory.message-templates'
import '/imports/test/factory.message-templates'
import './methods'
import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'

use(assertArrays)

const debug = require('debug')('app:messages:test')

// Tests start here

// prepare data for testing
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
  {
    type: 'email',
    to: '4j4xvusMLDcpQfwzq',
    subject: 'settlement-completed',
    body: 'another string?',
    data: {
      html: '<p>Example HTML content</p>',
      text: 'Example text content',
      subject: 'example subject',
      from_email: 'do-not-reply@mydomain.com.au',
      from_name: 'Back2bikes',
      to: [
        {
          email: 'test@mydomain.com.au',
          name: 'Recipient Name',
          type: 'to',
        },
      ],
      headers: {
        'Reply-To': 'message.reply@example.com',
      },
      important: true,
      bcc_address: 'do-not-reply@mydomain.com.au',
      tags: ['test-email'],
      recipient_metadata: [
        {
          rcpt: 'test@mydomain.com.au',
          values: {
            user_id: 123456,
          },
        },
      ],
    },
    priority: 1,
  },
]
const badMessages = [{}]

const willBeCancelled = {
  type: 'webhook',
  from: 'SE-admin',
  to: '4j4xvusMLDcpQfwzq',
  subject: 'settlement-completed',
  body: 'another string?',
  data: {
    webhookId: '4j4xvusMLDcpQfzzz',
    webhookURL: 'http://localhost:8080/webhooks/echo',
    payload: {
      eventType: 'settlement-completed',
      key: 'webhookItem key',
      externalId: 'the externalId',
      settlementDate: new Date(),
    },
  },
}

const settings = [
  {
    name: 'messages_enabled',
    key: 'messages_enabled',
    value: true,
  },
  {
    name: 'messages_maxRetries',
    key: 'messages_maxRetries',
    value: 10,
  },
  {
    name: 'messagesMaxSend',
    key: 'messagesMaxSend',
    value: 10,
  },
  {
    name: 'emailEnabled',
    key: 'emailEnabled',
    value: true,
  },
  {
    name: 'emailMaxRetries',
    key: 'emailMaxRetries',
    value: 10,
  },
  {
    name: 'messages_webhook_enabled',
    key: 'messages_webhook_enabled',
    value: true,
  },
  {
    name: 'messages_webhook_maxRetries',
    key: 'messages_webhook_maxRetries',
    value: 10,
  },
  {
    name: 'log2b',
    key: 'log2b',
    value: true,
  },
]

describe('Test messages methods', () => {
  before(async () => {
    await resetDatabase()
    // Add settings into mock db
    for (const setting of settings) {
      await insertSettings(setting)
    }
  })
  describe('Test with webhook transport', () => {
    it(`insert.messages should NOT work with INVALID message`, async () => {
      for (const message of badMessages) {
        let result
        result = await Meteor.callAsync('insert.messages', message)
        // debug(result)
        expect(result).to.have.property('status').which.equal('failed')
      }
    })
    it(`insert.messages should work with valid message`, async () => {
      for (const message of goodMessages) {
        let result
        result = await Meteor.callAsync('insert.messages', message)
        // debug(result)
        expect(result).to.have.property('status').which.equal('success')
        expect(result).to.have.property('id').which.to.be.a('string')
      }
    })
    it(`send.messages only send emails`, async () => {
      const result = await Meteor.callAsync('send.messages', 'email')
      expect(result).to.be.a('object')
      expect(result.status).to.be.a('string')
      expect(result.message).to.be.a('string')
    })
    it(`send.messages should work`, async () => {
      const result = await Meteor.callAsync('send.messages')
      debug(result)
      expect(result).to.be.a('object')
      expect(result.status).to.be.a('string')
      expect(result.message).to.be.a('string')
    })
  })
  describe('Test message cancelling methods', () => {
    it(`cancel.messages should not work with a invalid/not found message id`, async () => {
      let result
      result = await Meteor.callAsync('cancel.messages', Random.id())
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
    it(`cancel.messages should work with valid id`, async () => {
      let result
      // insert the message
      result = await Meteor.callAsync('insert.messages', willBeCancelled)
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
      expect(result).to.have.property('id').which.to.be.a('string')
      // then call cancel
      const { id } = result
      result = await Meteor.callAsync('cancel.messages', id)
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    })
  })
})
