// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Purchases from './schema'
import Factory from '/imports/test/factories'

const badPurchases = [
  // no profileId
  {
    productId: 'asdf23asdf',
    productName: 'A random widget',
    price: 5000
  },
  // no productId
  {
    profileId: 'asdf9kj98',
    productName: 'A random widget',
    price: 5000
  },
  // no price
  {
    profileId: 'asdf9kj98',
    productName: 'A random widget',
    productId: 'asdf23asdf'
  },
  // no name
  {
    profileId: 'asdf9kj98',
    price: 200,
    productId: 'asdf23asdf'
  }
]

const goodPurchases = [
  {
    profileId: 'asdf9kj98',
    productId: 'asdf23asdf',
    productName: 'A random widget',
    price: 5000,
    code: 'MISC',
    paymentMethod: 'credit card',
    status: 'current'
  }
]

// 'purchase' factory no longer exists
// goodPurchases.push(Factory.build('purchase'))

describe('purchases', () => {
  beforeEach(() => resetDatabase())

  goodPurchases.forEach((good, i) => {
    describe('PurchasesSchema good purchases', () => {
      it(`Succeeds on GOOD Purchases insert ${i + 1}`, async () => {
        await expect(Purchases.insertAsync(good)).to.be.fulfilled
      })
    })

    describe('query database good purchase', () => {
      it('success if database query matches', async () => {
        const purchaseId = await Purchases.insertAsync(good)
        const purchase = await Purchases.findOneAsync(purchaseId)

        expect(purchase._id).to.equal(good._id)
        const fields = 'profileId productId price productName'.split(/\s+/)
        fields.forEach(field => {
          expect(purchase[field]).to.equal(good[field])
        })
      })
    })

    badPurchases.forEach((bad, i) => {
      describe('PurchasesSchema bad parts', () => {
        it(`Succeeds on BAD Purchases insert ${i + 1}`, async () => {
          await expect(Purchases.insertAsync(bad)).to.be.rejected
        })
      })
    })
  })
})
