// schema.test.js

/* eslint-disable no-unused-expressions */

/**
 * schema test
 * we probably don't need to unit test all the schemas but I put this
 * suite together so i could understand how SimpleSchema.autoValue() actually
 * works and where the holes are.
 */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { Random } from 'meteor/random'

import Orders from '/imports/api/orders/schema'
import Factory from '/imports/test/factories'
import { RegExId } from '../schema';

const badOrders = [
  {},
  { _id: 1234, orderedParts: '12321312' },
  { totalPrice: '12321312' },
]

const goodOrders = [
  {
    status: 1,
    orderedParts: [{
      part: "Frame",
      price: 6000,
      qty: 3,
      partId: "3432n3",
      partNo: "22999",
      addedAt: new Date(),
      userId: "sakjd222",
    }],
    totalPrice: 9900,   // This is in cents
  },
]

goodOrders.push(Factory.build('order'))


describe('schema', () => {
  beforeEach(resetDatabase)

  badOrders.forEach((bad, i) => {
    describe('OrdersSchema bad orders', () => {
      it(`Throws on BAD Orders insert ${i + 1}`, () => {
        // fails validation, throws
        expect(() => Orders.insert(bad)).to.throw()
      })
    })
  })

  goodOrders.forEach((good, i) => {
    describe('OrdersSchema good orders', () => {
      it(`Succeeds on GOOD Orders insert ${i + 1}`, () => {
        console.log(good)
        console.log(good.orderedParts.userId)
        // passes, doesn't throw
        expect(() => Orders.insert(good)).not.to.throw()
      })
    })
  })

  describe('Order Status', () => {
    it('Checks on order status values', () => {

      // fails validation, throws
      let l = Factory.build('order')
      l.status = 99
      expect(() => Orders.insert(l)).to.throw()

      l = Factory.build('order')
      l.status = toString(1)
      expect(() => Orders.insert(l)).to.throw()

      l = Factory.build('order')
      l.status = 0
      expect(() => Orders.insert(l)).to.throw()

      l = Factory.build('order')
      l.status = 1
      expect(() => Orders.insert(l)).not.to.throw()

    })
  })
})
