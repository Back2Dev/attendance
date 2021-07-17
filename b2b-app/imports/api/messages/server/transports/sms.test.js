import { expect } from 'chai'

import transport, { SMSTransport } from './sms'

const debug = require('debug')('app:messages:sms:test')

const goodMessages = [
  {
    type: 'sms',
    data: {
      recipient: '+61412321321',
      sender: 'TestSender',
      message: 'this is a test',
    },
  },
]
const badMessages = [
  {
    type: 'not the sms',
    data: {}, // empty data
  },
  {
    type: 'sms', // not providing any data
  },
  {
    type: 'sms',
    data: 'some data', // bad data
  },
]
const badSendingMessages = [
  {
    type: 'sms',
    data: {},
    retries: 1,
  },
]

describe('Test SMS Transport', () => {
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
  it(`send() should not throw`, () => {
    goodMessages.map((message) => {
      expect(() => transport.send(message)).to.not.throw()
    })
  })
  it(`send() should not work when it's not enabled`, () => {
    const disabledTransport = new SMSTransport({ enabled: false })
    badSendingMessages.map(async (message) => {
      const result = await disabledTransport.send(message)
      expect(result).to.be.a('object')
      expect(result.status).equal('info')
    })
  })
})
