import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import moment from 'moment'
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
  paymentCustId: '1234',
  expiry: moment()
    .add('2', 'day')
    .toDate(),
  email: 'mikkel@back2bikes.com.au'
})

if (Meteor.isServer) {
  describe('Reconcile carts -', () => {
    // beforeEach(resetDatabase)
    resetDatabase()
    let memberId
    let productId
    let cart = null

    it('populates the data', () => {
      expect(() => {
        // Create shop data
        populateShop()
        'products productTypes events promos'.split(/\s+/).forEach(collection => {
          Meteor.call('seed.products', Meteor.settings.public.orgid, collection)
        })
        // debug('products', Members.find({}).fetch())
      }).to.not.throw()
    })
  })
}
