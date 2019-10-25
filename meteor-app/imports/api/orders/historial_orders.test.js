import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Orders from '/imports/api/orders/schema'
import OrderEmails from '/imports/api/orderemails/schema'
import '/imports/api/orders/methods'
import Factory from '/imports/test/factories'
import data from '/imports/test/bpw-emails'

// const goodOrder = Factory.build('order')
// const orderId = goodOrder._id

if (Meteor.isServer) {
  describe('historial orders method', () => {
    beforeEach(resetDatabase)

    it('success on importing emails', () => {
      expect(() => Meteor.call('orders.email.read', data.mailbox)).to.not.throw()
      const n = OrderEmails.find({}).fetch().length
      expect(n).to.equal(4)
    })

    it('detects existing orderemails and does not import them', () => {
      let n = OrderEmails.find({}).fetch().length
      expect(n).to.equal(0)

      expect(() => Meteor.call('orders.email.read', data.mailbox)).to.not.throw()
      n = OrderEmails.find({}).fetch().length
      expect(n).to.equal(4)

      expect(() => Meteor.call('orders.email.read', data.mailbox)).to.not.throw() //Second time should not add any more
      n = OrderEmails.find({}).fetch().length
      expect(n).to.equal(4)
    })

    // it('success on parsing an email', () => {
    //   expect(() => Meteor.call('orders.email.parse', data.single)).to.not.throw()
    // })
  })
}
