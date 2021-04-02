import { findBykeyword, findAndReplace, sendMessages } from './functions'
import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { insertSettings } from '/imports/api/settings/server/helper'
import { createTestTemplates } from '/imports/test/factory.message-templates'
import { createSMS, createEmail, createApp, getTemplate } from './functions'
import { expect } from 'chai'

const debug = require('debug')('b2b:messages:test')

const listing = {
  _id: 'pkhXhRTMhWoXK5GZE',
  address: '33 Buy Street, Melbourne VIC 3051, Australia',
  transactionType: 'buy',
  stage: 'contract',
  persons: [
    {
      userId: 'WmH6tRCBvMycetkZg',
      name: 'John Smith',
      mobile: '+6410000',
      email: 'test@test.com',
      role: 'CUS',
      primary: true,
    },
    {
      userId: 'WmH6tRCBvMycetkZg',
      name: 'Susan Green',
      mobile: '+6410000',
      email: 'test@test.com',
      role: 'CUS',
      primary: true,
    },
    {
      userId: 'WmH6tRCBvMycetkZg',
      name: 'Max Whitefield',
      mobile: '+6410000',
      email: 'test@test.com',
      role: 'AGT',
      primary: true,
    },
    {
      userId: 'WmH6tRCBvMycetkZg',
      name: 'Conwell Red',
      mobile: '+6410000',
      email: 'test@test.com',
      role: 'CON',
      primary: true,
    },
  ],
  search: '33 Buy Street, Melbourne VIC 3051, Australia',
  status: 'active',
  createdAt: {
    $date: '2020-12-23T00:08:09.829Z',
  },
  updatedAt: {
    $date: '2021-01-04T23:58:01.207Z',
  },
}
const emailMessage = {
  type: 'EMAIL',
  body: `<div>Thank you for choosing Startup Inc.</div>
  <br/>
  <div> \`AGT\` added a listing for you. Please set up or login to your account by clicking <a href="\`URL\`">here.</a></div>
  <br/>
  <div> Details: </div>
  <br/>
  <div> Address: \`address\` </div>
  <div> Type: \`type\` </div>
  <br/>`,
}
const smsMessage = {
  type: 'SMS',
  body:
    'You have been assigned `address`. Please call `CUS` to introduce yourself within the next 2 hours and prepare and upload the Contract Review if required.  Cheers, Startup Inc  This is an automated SMS, please do not reply.',
}

describe('messages functions', () => {
  it('finds a the address in the listing and returns it', () => {
    const keyword = 'address'
    const result = findBykeyword({ data: listing, keyword })
    expect(result).to.be.equal(listing.address)
  })
  it('merges data into an SMS', () => {
    const result = findAndReplace({ data: listing, template: smsMessage })
    expect(result).to.be.equal(
      'You have been assigned 33 Buy Street, Melbourne VIC 3051, Australia. Please call John Smith, Susan Green to introduce yourself within the next 2 hours and prepare and upload the Contract Review if required.  Cheers, Startup Inc  This is an automated SMS, please do not reply.'
    )
  })
  it('merges data into an email', () => {
    listing.type = 'buying'
    listing.URL = 'this is a link'
    const result = findAndReplace({ data: listing, template: emailMessage })
    expect(result).to.be.equal(`<div>Thank you for choosing Startup Inc.</div>
  <br/>
  <div> Max Whitefield added a listing for you. Please set up or login to your account by clicking <a href="this is a link">here.</a></div>
  <br/>
  <div> Details: </div>
  <br/>
  <div> Address: 33 Buy Street, Melbourne VIC 3051, Australia </div>
  <div> Type: buying </div>
  <br/>`)
  })
})

const goodMessages = [
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
      from_name: 'Startup Inc',
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
]

describe('Test messages functions', () => {
  before(() => {
    resetDatabase()
    // Add settings into mock db
    settings.map((setting) => {
      insertSettings(setting)
    })
    createTestTemplates()
  })
  describe('Test with webhook transport', () => {
    it(`insert.messages should NOT work with INVALID message`, () => {
      badMessages.map((message) => {
        let result
        expect(() => {
          result = Meteor.call('insert.messages', message)
        }).not.to.throw()
        // debug(result)
        expect(result).to.have.property('status').which.equal('failed')
      })
    })
    it(`insert.messages should work with valid message`, () => {
      goodMessages.map((message) => {
        let result
        expect(() => {
          result = Meteor.call('insert.messages', message)
        }).not.to.throw()
        debug(result)
        expect(result).to.have.property('status').which.equal('success')
        expect(result).to.have.property('id').which.to.be.a('string')
      })
    })
    it(`send.messages only send emails`, () => {
      const result = sendMessages('email')
      expect(result).to.be.a('object')
      expect(result.status).to.be.a('string')
      expect(result.message).to.be.a('string')
    })
    it(`send.messages only send webhook`, () => {
      const result = sendMessages('webhook')
      debug(result)
      expect(result).to.be.a('object')
      expect(result.status).to.be.a('string')
      expect(result.message).to.be.a('string')
    })
  })
  describe('Test message cancelling methods', () => {
    it(`cancel.messages should not work with a invalid/not found message id`, () => {
      let result
      expect(() => {
        result = Meteor.call('cancel.messages', Random.id())
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
    it(`cancel.messages should work with valid id`, () => {
      let result
      // insert the message
      expect(() => {
        result = Meteor.call('insert.messages', willBeCancelled)
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
      expect(result).to.have.property('id').which.to.be.a('string')
      // then call cancel
      const { id } = result
      expect(() => {
        result = Meteor.call('cancel.messages', id)
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    })
  })
})

describe('merge message functions', () => {
  before(() => {
    resetDatabase()
    // Add settings into mock db
    settings.map((setting) => {
      insertSettings(setting)
    })
    createTestTemplates()
  })
  it('successfully merges email data and inserts message', () => {
    const form = {
      to: [{ name: 'charlie customer', email: 'test@test.com' }],
      body: 'This is a test',
    }
    const subject = 'test email merge'
    const result = createEmail(form, subject)
    expect(result).to.have.property('status').which.equal('success')
  })
  it('fails to merge email data due to bad data', () => {
    const form = 'bad data'
    const subject = 'test email merge'
    const result = createEmail(form, subject)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('Successfully merges sms data and inserts messages', () => {
    let form = {
      to: '04123213',
      data: {},
      body: 'testing message',
      priority: 5,
    }
    const result = createSMS(form)
    expect(result).to.have.property('status').which.equal('success')
  })
  it('fails to merge sms data due to missing data', () => {
    let form = {
      data: {},
      body: 'testing message',
      priority: 5,
    }
    const result = createSMS(form)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('successfully creates an inapp message', () => {
    const form = { data: {}, body: 'This is a test' }
    const person = { userId: 'test12345', name: 'Test' }
    const template = { url: '/approve/:taskId' }
    const listingId = 'test123456'
    const taskId = '3423432432'
    const result = createApp(form, person, template, listingId, taskId)
    expect(result).to.have.property('status').which.equal('success')
  })
  it('fails to create an inapp message due to missing listingId', () => {
    const form = { data: {}, body: 'This is a test' }
    const person = { userId: 'test12345', name: 'Test' }
    const template = { url: '/approve/:taskId' }

    const result = createApp(form, person, template)
    expect(result).to.have.property('status').which.equal('failed')
  })
})
