import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import moment from 'moment'
import './cron-payment'
import './email'
import Members from '/imports/api/members/schema'
import Products, { Carts } from '/imports/api/products/schema'

const debug = require('debug')('b2b:test')

// A list of retirement ages for the test
const RETIREMENT_AGES = [90, 45, 10]

const goodMember = Factory.build('member', {
  autoPay: true,
  subsType: 'member',
  paymentCustId: '1234',
  expiry: moment()
    .add('2', 'day')
    .toDate(),
  email: 'mikkel@back2bikes.com.au'
})

if (Meteor.isServer) {
  describe('Old cart retirement -', () => {
    // beforeEach(resetDatabase)
    resetDatabase()
    let memberId
    let productId
    let cart = null

    it('creates a new member', () => {
      expect(() => {
        // Create a member
        memberId = Members.insert(goodMember)
        productId = Products.insert(Factory.build('product'))
      }).to.not.throw()
    })

    it(`inserts old carts at ${RETIREMENT_AGES.join()} days`, () => {
      expect(() => {
        RETIREMENT_AGES.forEach(age => {
          const id = Carts.insert(
            Factory.build('cart', {
              memberId,
              status: 'ready'
            })
          )
          Carts.update(
            id,
            {
              $set: {
                updatedAt: moment()
                  .subtract(age, 'day')
                  .toDate()
              }
            },
            { bypassCollection2: true }
          )
        })
      }).to.not.throw()
      expect(Carts.find({ memberId }).count()).to.be.equal(RETIREMENT_AGES.length)
    })
    it('now it finds the only remaining cart', () => {
      expect(() => {
        cart = Meteor.call('retireOldCarts', memberId)
      }).to.not.throw()
      expect(Carts.find({ memberId }).count()).to.be.equal(1)
    })
  })
}
