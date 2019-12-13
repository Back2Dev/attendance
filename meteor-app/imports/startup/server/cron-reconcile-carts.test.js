import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import './cron-payment'
import './email'
import CONSTANTS from '/imports/api/constants'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import '/imports/startup/server'

const debug = require('debug')('b2b:test-payment-reconciliation')

const goodMember = Factory.build('member', {
  autoPay: true,
  subsType: 'member',
  paymentCustId: 'UNCHANGED',
  status: 'expired',
  subsType: 'none',
  remaining: 0,
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
  describe('Reconcile completed shopping carts -', () => {
    beforeEach(resetDatabase)
    let memberId

    const sampleCart = Factory.build('cart', {
      status: 'complete',
      creditCard: { email: goodMember.email },
      chargeResponse: { customerToken: 'SPECIAL-TOKEN' }
    })
    delete sampleCart.memberId
    // Set up list of carts using the above as-is
    const goodCarts = [
      { cart: sampleCart, desc: 'cart.creditCard.email, membership', subsType: 'member', remaining: 0 }
    ]
    //
    // Second cart moves the email to chargeResponse, and changes the product to a 10 visit pass
    //
    let newCart = cloneDeep(sampleCart)
    let productId = 'ekFJq9mrEjPer3PHW'
    newCart.prodqty = { [productId]: 1 }
    newCart.products[0] = {
      _id: productId, // Fake _id doesn't matter as db doesn't check it
      name: 'PA Multipass x 10',
      price: 150 * 100,
      description: '10 sessions ',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-PASS-MULTI-10',
      active: true,
      qty: 10,
      autoRenew: true,
      duration: 2,
      subsType: 'pass',
      image: '/images/pass.jpg'
    }
    newCart.chargeResponse.email = newCart.creditCard.email
    delete newCart.creditCard.email
    goodCarts.push({ cart: newCart, desc: 'cart.chargeResponse.email, MULTI', subsType: 'pass', remaining: 10 })

    //
    // Third cart moves the email to chargeResponse, and changes the product to 2 x 10 visit pass
    //
    newCart = cloneDeep(sampleCart)
    newCart.prodqty = { [productId]: 2 }
    newCart.products[0] = {
      _id: productId, // Fake _id doesn't matter as db doesn't check it
      name: 'PA Multipass x 10',
      price: 150 * 100,
      description: '10 sessions ',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-PASS-MULTI-10',
      active: true,
      qty: 10,
      autoRenew: true,
      duration: 2,
      subsType: 'pass',
      image: '/images/pass.jpg'
    }
    goodCarts.push({ cart: newCart, desc: '2 x MULTI-10', subsType: 'pass', remaining: 20 })

    //
    // Fourth cart moves the email to chargeResponse, and changes the product to a 10 visit pass
    //
    newCart = cloneDeep(sampleCart)
    newCart.prodqty = { [productId]: 1 }
    newCart.products[0] = {
      _id: productId, // Fake _id doesn't matter as db doesn't check it
      name: 'PA Casual session',
      price: 20 * 100,
      description: '1 session',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-CASUAL',
      autoRenew: true,
      active: true,
      duration: 2,
      qty: 1,
      subsType: 'casual',
      image: '/images/pass.jpg'
    }
    goodCarts.push({ cart: newCart, desc: 'casual pass', subsType: 'casual', remaining: 1 })

    // Set up the failure cases
    const badCarts = cloneDeep(goodCarts)
    // Provide an unknown email for the cart
    badCarts[0].cart.creditCard.email = 'bogus-email@gigglebox.cox.tv'
    // Provide an unknown email for the cart
    badCarts[1].cart.chargeResponse.email = 'bogus-email@gigglebox.cox.tv'
    // Provide an unknown email for the cart
    badCarts[2].cart.creditCard.email = 'bogus-email@gigglebox.cox.tv'
    badCarts[3].cart.creditCard.email = 'bogus-email@gigglebox.cox.tv'

    //
    // Loop through the tests
    //
    goodCarts.forEach((c, ix) => {
      it(`Reconciles cart ${ix + 1} to the member (from ${c.desc})`, () => {
        expect(() => {
          // Create a member
          memberId = Members.insert(goodMember)
          Carts.insert(c.cart)
        }).to.not.throw()
        Products.insert(c.cart.products[0])
        // Pre-condition:
        const b4 = Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length
        expect(b4).to.equal(0)
        const p4 = Purchases.find({}).fetch().length
        expect(p4).to.equal(0)
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        // Post conditions, Find the cart, purchase and member:
        expect(Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length).to.equal(1)
        expect(Purchases.find({}).fetch().length).to.equal(1)
        debug('Purchase', Purchases.find({}).fetch())
        let member = Members.findOne(memberId)
        expect(member.paymentCustId).to.equal('SPECIAL-TOKEN')
        //
        // Run it again
        //
        expect(() => {
          Meteor.call('reconcileCompletedCarts')
        }).to.not.throw()
        // Still only one cart there
        expect(Carts.find({ status: 'complete', memberId: { $exists: true } }).fetch().length).to.equal(1)
        //
        // Update status, and check that it happened
        //
        member = Members.findOne(memberId)
        expect(member.status).to.equal('expired')
        expect(member.subsType).to.equal('none')
        expect(member.remaining).to.equal(0)
        Meteor.call('updateMemberStatusAll')
        Meteor.call('updateSubsTypeAll')
        Meteor.call('updateRemainingAll')
        member = Members.findOne(memberId)
        expect(member.status).to.equal('current')
        expect(member.subsType).to.equal(c.subsType)
        expect(member.remaining).to.equal(c.remaining)
      })
    })

    badCarts.forEach(c => {
      it(`Fails to reconcile the cart to the member (from ${c.desc})`, () => {
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
