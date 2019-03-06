import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Transactions from './transactions'
import Factory from '/imports/test/factories'
// import { RegExId } from '../schema'

const badTransactions = [
    // no memberId
  {
    productId: 'asdf23asdf',
    price: 5000,
  },
    // no productId
  {
    memberId: 'asdf9kj98',
    price: 5000,
  },
    // no price
  {
    memberId: 'asdf9kj98',
    productId: 'asdf23asdf',
  },
   // price is a string
  {
    memberId: 'asdf9kj98',
    productId: 'asdf23asdf',
    price: "5000",
  },
]

const goodTransactions = [
  {
    memberId: 'asdf9kj98',
    productId: 'asdf23asdf',
    price: 5000,
  },
]

goodTransactions.push(Factory.build('product'))

describe('transactions', () => {
  beforeEach(resetDatabase)

  goodTransactions.forEach((good, i) => {
    describe('TransactionsSchema good products', () => {
      it(`Succeeds on GOOD Transactions insert ${i + 1}`, () => {
        expect(() => Transactions.insert(good)).not.to.throw()
      })
    })

    describe('query database good transaction', () => {
      it('success if database query matches', () => {
        const transactionId = Transactions.insert(good)
        const transaction = Transactions.findOne(transactionId)

        expect(transaction._id).to.equal(good._id)
        expect(transaction.memberId).to.equal(good.memberId)
        expect(transaction.productId).to.equal(good.productId)
        expect(transaction.price).to.equal(good.price)       
      })
    })

    badTransactions.forEach((bad, i) => {
      describe('TransactionsSchema bad parts', () => {
        it(`Succeeds on BAD Transactions insert ${i + 1}`, () => {
          expect(() => Transactions.insert(bad)).to.throw()
        })
      })
    })
  })
})

