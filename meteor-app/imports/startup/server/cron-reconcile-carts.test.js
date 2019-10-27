import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import './cron-payment'
import './email'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import populateShop from '/imports/test/fake-pa-shop'
import '/imports/startup/server'

const debug = require('debug')('b2b:test-payment-reconciliation')

const goodMember = Factory.build('member', {
  autoPay: true,
  subsType: 'member',
  paymentCustId: 'UNCHANGED',
  expiry: moment()
    .add('2', 'day')
    .toDate(),
  email: 'mikkel@back2bikes.com.au'
})

if (Meteor.isServer) {
  //
  // Test needs Members, Carts
  //  Purchases will be inserted
  //
  describe.only('Reconcile good carts -', () => {
    beforeEach(resetDatabase)
    // resetDatabase()
    let memberId

    const sampleCart = Factory.build('cart', {
      status: 'complete',
      creditCard: { email: goodMember.email },
      chargeResponse: { customerToken: 'SPECIAL-TOKEN' }
    })
    delete sampleCart.memberId
    const goodCarts = [{ cart: sampleCart, desc: 'cart.creditCard.email' }]
    let newCart = cloneDeep(sampleCart)
    newCart.chargeResponse.email = newCart.creditCard.email
    delete newCart.creditCard.email
    goodCarts.push({ cart: newCart, desc: 'cart.chargeResponse.email' })

    const badCarts = cloneDeep(goodCarts)
    badCarts[0].cart.creditCard.email = 'bogus-email@gigglebox.cox.tv'
    badCarts[1].cart.chargeResponse.email = 'bogus-email@gigglebox.cox.tv'

    //
    // Loop through the tests
    //
    goodCarts.forEach(c => {
      it(`Reconciles the cart to the member (from ${c.desc})`, () => {
        expect(() => {
          // Create a member
          memberId = Members.insert(goodMember)
          Carts.insert(c.cart)
        }).to.not.throw()
        // Pre-condition:
        const b4 = Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length
        expect(b4).to.equal(0)
        const p4 = Purchases.find({}).fetch().length
        expect(p4).to.equal(0)
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        // Post condition:
        const afta = Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length
        expect(afta).to.equal(1)
        const pafta = Purchases.find({}).fetch().length
        expect(pafta).to.equal(1)
        debug('Pucrhase', Purchases.find({}).fetch())
        const member = Members.findOne(memberId)
        expect(member.paymentCustId).to.equal('SPECIAL-TOKEN')
        //
        // Run it again
        //
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        expect(Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length).to.equal(1)
      })
    })

    badCarts.forEach(c => {
      it(`Fails to reconciles the cart to the member (from ${c.desc})`, () => {
        expect(() => {
          // Create a member
          memberId = Members.insert(goodMember)
          Carts.insert(c.cart)
        }).to.not.throw()
        // Pre-condition:
        const b4 = Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length
        expect(b4).to.equal(0)
        const p4 = Purchases.find({}).fetch().length
        expect(p4).to.equal(0)
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        // Post condition:
        const afta = Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length
        expect(afta).to.equal(0)
        const pafta = Purchases.find({}).fetch().length
        expect(pafta).to.equal(0)
        debug('Pucrhase', Purchases.find({}).fetch())
        const member = Members.findOne(memberId)
        expect(member.paymentCustId).to.equal('UNCHANGED')
        //
        // Run it again
        //
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        expect(Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length).to.equal(0)
      })
    })

    //   it('populates the product data', () => {
    //     expect(() => {
    //       // Create shop data
    //       populateShop()
    //       // Loop through the various tables to seed the data
    //       'products productTypes events promos'.split(/\s+/).forEach(collection => {
    //         Meteor.call('seed.products', Meteor.settings.public.orgid, collection)
    //       })
    //       // debug('products', Members.find({}).fetch())
    //     }).to.not.throw()
    //   })
    // })
  })
}
