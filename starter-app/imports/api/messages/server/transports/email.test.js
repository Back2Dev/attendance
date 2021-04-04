import { expect } from 'chai'

import transport, { EmailTransport } from './email'

const debug = require('debug')('b2b:messages:email:test')

const goodMessages = [
  {
    type: 'email',
    data: {
      html: '<p>Example HTML content</p>',
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
        'Reply-To': 'test@mydomain.com.au',
      },
    },
  },
]
const badMessages = [
  {
    type: 'not the email',
    data: {}, // empty data
  },
  {
    type: 'email', // not providing any data
  },
  {
    type: 'email',
    data: 'some data', // bad data
  },
]
const badSendingMessages = [
  {
    type: 'email',
    data: {},
    retries: 1,
  },
]

describe('Test Email Transport', () => {
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
    const disabledTransport = new EmailTransport({ enabled: false })
    badSendingMessages.map(async (message) => {
      const result = await disabledTransport.send(message)
      // debug('bad sending result', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('info')
      return result
    })
  })
})
