import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import '/imports/api/orders/methods'
import Factory from '/imports/test/factories'
import data from '/imports/test/bpw-emails'

const goodOrder = Factory.build('order')
const orderId = goodOrder._id

if (Meteor.isServer) {
  describe.only('historial orders method', () => {
    it('success on importing emails', () => {
      expect(() => Meteor.call('orders.email.read', data.mailbox)).to.not.throw()
    })

    // it('success on parsing an email', () => {
    //   expect(() => Meteor.call('orders.email.parse', data.single)).to.not.throw()
    // })
  })
}
