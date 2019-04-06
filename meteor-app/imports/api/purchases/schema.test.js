// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Purchases from './schema'
import Factory from '/imports/test/factories'

const badPurchases = [
  // no memberId
  {
    productId: 'asdf23asdf',
    price: 5000
  },
  // no productId
  {
    memberId: 'asdf9kj98',
    price: 5000
  },
  // no price
  {
    memberId: 'asdf9kj98',
    productId: 'asdf23asdf'
  }
]

const goodPurchases = [
  {
    memberId: 'asdf9kj98',
    productId: 'asdf23asdf',
    price: 5000,
    code: 'MISC'
  }
]

goodPurchases.push(Factory.build('purchase'))

describe('purchases', () => {
  beforeEach(resetDatabase)

  goodPurchases.forEach((good, i) => {
    describe('PurchasesSchema good purchases', () => {
      it(`Succeeds on GOOD Purchases insert ${i + 1}`, () => {
        expect(() => Purchases.insert(good)).not.to.throw()
      })
    })

    describe('query database good purchase', () => {
      it('success if database query matches', () => {
        const purchaseId = Purchases.insert(good)
        const purchase = Purchases.findOne(purchaseId)

        expect(purchase._id).to.equal(good._id)
        expect(purchase.memberId).to.equal(good.memberId)
        expect(purchase.productId).to.equal(good.productId)
        expect(purchase.price).to.equal(good.price)
      })
    })

    badPurchases.forEach((bad, i) => {
      describe('PurchasesSchema bad parts', () => {
        it(`Succeeds on BAD Purchases insert ${i + 1}`, () => {
          expect(() => Purchases.insert(bad)).to.throw()
        })
      })
    })
  })
})
