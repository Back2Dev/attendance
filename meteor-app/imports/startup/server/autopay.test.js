import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import moment from 'moment'
import './cron-jobs'
import './cron-payment'
import './email'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'

const debug = require('debug')('b2b:test-autopay')

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
  describe('Membership cron processing -', () => {
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
    it('at first it cannot find a cart', () => {
      expect(() => {
        cart = Meteor.call('findMemberCart', memberId)
      }).to.not.throw()
      expect(cart).to.be.equal(null)
    })
    it('creates some past purchases', () => {
      expect(() => {
        // Create a couple of purchases...
        Purchases.insert(
          Factory.build('purchase', {
            memberId,
            productId,
            expiry: moment()
              .subtract('90', 'day')
              .toDate()
          })
        )
        Purchases.insert(
          Factory.build('purchase', {
            memberId,
            productId,
            expiry: moment()
              .add('2', 'day')
              .toDate()
          })
        )
      }).to.not.throw()
    })

    it('now it finds an (autocreated) cart', () => {
      expect(() => {
        cart = Meteor.call('findMemberCart', memberId)
      }).to.not.throw()
      expect(cart).to.be.not.equal(null)
    })

    it('cleans up cart and purchases', () => {
      expect(() => {
        cart = null
        Carts.remove({})
        Purchases.remove({})
      }).to.not.throw()
      // Fail to find a cart...
      expect(() => {
        cart = Meteor.call('findMemberCart', memberId)
      }).to.not.throw()
      expect(cart).to.be.equal(null)
    })

    it('inserts a new cart', () => {
      Carts.insert(Factory.build('cart', { memberId, status: 'ready' }))
      // debug(`Newly inserted cart:`, Carts.find({}).fetch())
    })
    it('now it finds the new cart', () => {
      expect(() => {
        cart = Meteor.call('findMemberCart', memberId)
      }).to.not.throw()
      expect(cart).to.be.not.equal(null)
    })

    it('sends the autopay notice', () => {
      expect(cart.autoPayNoticeDate).to.be.equal(undefined)
      expect(() => {
        Meteor.call('autoPayNotice')
      }).to.not.throw()
      expect(() => {
        cart = Carts.findOne(cart._id)
      }).to.not.throw()
      expect(typeof cart.autoPayNoticeDate).to.be.equal('date')
    })
  })
}
