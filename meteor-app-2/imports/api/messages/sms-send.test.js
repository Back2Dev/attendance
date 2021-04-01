import { sendSMS } from './sms-send'
import { expect } from 'chai'

describe('using SNS service to send sms', () => {
  it('sends a sms', () => {
    sendSMS('+64111111111', 'Mydomain', 'this is a test')
  })
})
