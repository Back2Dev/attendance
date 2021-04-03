import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { expect } from 'chai'
import { Factory } from 'meteor/dburles:factory'
import Messages from '/imports/api/messages/schema'
import '/imports/api/triggers/methods'

const debug = require('debug')('b2b:userpubs')

describe('User publications', () => {
  before(function () {
    resetDatabase()
    Factory.create('user', {
      name: 'Connie Vey',
      emails: [{ address: 'connie.convey@test.com', verified: false }],
    })
    Factory.create('triggers', {
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
    Factory.create('messageTemplates', {
      body:
        'Dear *|nickname|*, \nPlease change your password by clicking [here.] (*|url|*)',
      name: 'convx-forgotpassword',
      revision: 1,
      slug: 'forgot-password',
      type: 'EMAIL',
    })
  })
  describe('password reset function', () => {
    it('creates a message to be sent to user for a password reset', () => {
      const testEmail = 'connie.convey@test.com'
      expect(() => {
        Meteor.call('sendResetPasswordEmail', testEmail)
      }).to.not.throw()
      const message = Messages.findOne({ to: testEmail })
      expect(message).to.not.be.empty
    })
    it('fails to create a message when there is no email', () => {
      const result = Meteor.call('sendResetPasswordEmail')
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
