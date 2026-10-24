import { sendSMS } from './sms-send'
import { expect } from 'chai'
import Factory from '/imports/test/factories'
import { resetDatabase } from '/imports/api/cleaner'

// only use if you are testing the sms service. It costs money to run this test all the time.
describe.skip('using SMS broadcast service to send sms', () => {
  before(async () => {
    await resetDatabase()
    await Factory.createAsync('settings', {
      name: 'SMS service',
      key: 'sms-service',
      value: 'smsbroadcast',
    })
  })
  it('sends a sms', async () => {
    const testData = {
      recipient: '61466614265',
      sender: 'Startup',
      message: 'Test SMS please ignore',
    }

    await sendSMS(testData)
  })
})
