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
  {
    _id: 1234,
    orderedParts: 'sadsd',
  },

  {
    status: 7,
    orderedParts: [],
    totalPrice: 'expect fail',   // This is in cents
  },

  {
    _id: 2323,
    status: 15,
    additionalNotes: 107,
    orderedParts: {},
    totalPrice: 'expect fail',
  },

  {
    status: 1,
    orderedParts: [{
      name: 'Limited Edition Frame',
      price: 60.10,
      qty: 0,
      partId: '3432n3',
      partNo: '22999',
      addedAt: new Date(),
      userId: 'user55',
    }],
    totalPrice: 9900.10,   // This is in cents
  },

  {
    status: -1,
    orderedParts: [{
      name: 'Blue Bike Bell',
      price: 4000,
      qty: 3.5,
      partNo: 2114567788644,
      addedAt: new Date(),
      userId: 'user55',
    }],
    totalPrice: 9900,   // This is in cents
  },
]


const goodOrders = [
  // one part
  {
    status: 1,
    orderedParts: [{
      name: 'Frame',
      price: 6000,
      qty: 3,
      partId: '3432n3',
      partNo: '22999',
      addedAt: new Date(),
      userId: 'sds',
    }],
    totalPrice: 1100,   // This is in cents
  },

  {
    status: 4,
    orderedParts: [],
    totalPrice: 11100,   // This is in cents
  },

  {
    status: 2,
    orderedParts: [{
      name: 'Limited Edition Frame',
      price: 60.00,
      qty: 5,
      partId: '3432n3',
      partNo: '22999',
      addedAt: new Date(),
      userId: 'user55',
    }],
    totalPrice: 8888,
  },

  // many parts
  {
    status: 3,
    orderedParts: [
      {
        name: 'Handle Bar',
        price: 3333,
        qty: 1,
        partId: 'abc123',
        partNo: '007',
        addedAt: new Date(),
        userId: 'mr.cool',
      },
      {
        name: 'Brake Lever',
        price: 2144,
        qty: 10,
        partId: 'l-k343',
        partNo: '67900',
        addedAt: new Date(),
        userId: 'user56',
      },
      {
        name: 'Braided Line',
        price: 2,
        qty: 3,
        partId: '991',
        partNo: '619619',
        addedAt: new Date(),
        userId: 'mark',
      },
    ],
    totalPrice: 4444,   // This is in cents
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
        // passes, doesn't throw
        expect(() => Orders.insert(good)).not.to.throw()
      })
    })

    describe('query database good records', () => {
      it('Return database query', () => {

        const orderId = Orders.insert(good)
        const order = Orders.findOne(orderId)

        expect(order._id).to.equal(good._id)
        expect(order.totalPrice).to.equal(good.totalPrice)

        let ok = true
        if (good.orderedParts && good.orderedParts.length) {
          good.orderedParts.forEach((part, i) => {
            Object.keys(part).forEach(key => {
              if (part[key] !== good.orderedParts[i][key]) {
                ok = false
              }
              expect(part[key]).to.equal(good.orderedParts[i][key])
            })
          })
        }

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