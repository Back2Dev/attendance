import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
import { Factory } from 'meteor/dburles:factory'
import Messages from '/imports/api/messages/schema'
import '/imports/api/users/server/publications'
import '/server/methods'

const debug = require('debug')('app:userpubs')

describe('User publications', () => {
  before(async () => {
    await resetDatabase()
    await Factory.createAsync('user', {
      name: 'Connie Vey',
      emails: [{ address: 'connie.convey@test.com', verified: false }],
    })
    await Factory.createAsync('triggers', {
      slug: 'reset-password',
      name: 'Reset password',
      notifications: [
        {
          text: 'forgot-password',
          recipients: 'USR',
          trigger: 'complete',
          method: 'EMAIL',
          number: 999,
        },
      ],
    })
    await Factory.createAsync('messageTemplates', {
      body:
        'Dear *|nickname|*, \nPlease change your password by clicking [here.] (*|url|*)',
      name: 'convx-forgotpassword',
      revision: 1,
      slug: 'forgot-password',
      type: 'EMAIL',
    })
  })
  describe('password reset function', () => {
    it('creates a message to be sent to user for a password reset', async () => {
      const testEmail = 'connie.convey@test.com'
      await expect(Meteor.callAsync('sendResetPasswordEmail', testEmail)).to.be.fulfilled
      const message = await Messages.findOneAsync({ to: testEmail })
      expect(message).to.not.be.empty
    })
    it('fails to create a message when there is no email', async () => {
      const result = await Meteor.callAsync('sendResetPasswordEmail')
      expect(result).to.have.property('status').which.equal('failed')
    })
    // TODO : Fix this test
    // it('fails when it doesnt find an email in the system', () => {
    //   const badEmail = 'no.such.e.mail@test.com'
    //   const result = Meteor.call('sendResetPasswordEmail', badEmail)
    //   expect(result).to.have.property('error')
    // })
  })
})
