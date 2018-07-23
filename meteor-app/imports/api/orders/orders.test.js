import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import '/imports/api/orders/methods'
import Factory from '/imports/test/factories'
import { resetDatabase } from '/imports/test/util-test'
import { relativeTimeThreshold } from '../../../node_modules/moment';


const goodOrder = Factory.build('order')
const orderId = goodOrder._id

if (Meteor.isServer) {
  describe('testing orders method', () => {
    it('success on inserting GOOD order', () => {
      expect(() => Meteor.call('orders.insert', goodOrder)).to.not.throw()
    })

    it('success on removing an order', () => {
      const order = Orders.findOne(orderId)
      expect(() => Meteor.call('orders.remove', order)).to.not.throw()
    })

    it('success on updating an order', () => {
      const orderedPart = goodOrder.orderedParts
      expect(() => Meteor.call('orders.addPart', orderId, orderedPart)).to.not.throw()
    })
  })
}