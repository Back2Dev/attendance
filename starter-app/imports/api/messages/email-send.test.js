import { sendEmail } from './email-send'
import { expect } from 'chai'

const message = {
  html: '<p>Example HTML content</p>',
  text: 'Example text content',
  subject: 'example subject',
  from_email: 'do-not-reply@mydomain.com.au',
  from_name: 'Settle Easy',
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
}

describe('sending emails', () => {
  it('sends an example email', async () => {
    const result = await sendEmail(message)
    expect(result[0].status).to.be.equal('sent')
  })
})
