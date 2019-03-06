// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Transactions from './schema'
import Factory from '/imports/test/factories'
import { RegExId } from '../schema';


const baddies = [
  {},
  {
    _id: 1234,
    orderedParts: 'sadsd',
  },

]


const goodies = [
  {
    status: 1,
    totalPrice: 1100,   // This is in cents
  },

]


describe.only('Transactions schema', () => {
  beforeEach(resetDatabase)

  baddies.forEach((bad, i) => {
    describe('TransactionsSchema bad Transactions', () => {
      it(`Throws on BAD Transactions insert ${i + 1}`, () => {
        // fails validation, throws
        expect(() => Transactions.insert(bad)).to.throw()
      })
    })
  })

  goodies.forEach((good, i) => {
    describe('TransactionsSchema good Transactions', () => {
      it(`Succeeds on GOOD Transactions insert ${i + 1}`, () => {
        // passes, doesn't throw
        expect(() => Transactions.insert(good)).not.to.throw()
      })
    })

    describe('query database good records', () => {
      it('Return database query', () => {

        const orderId = Transactions.insert(good)
        const order = Transactions.findOne(orderId)

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


})