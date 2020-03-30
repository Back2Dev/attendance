// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Charges from './schema'
import Factory from '/imports/test/factories'

const badCharges = [
  // no name
  {}
]

const goodCharges = [{}]

goodCharges.push(Factory.build('charges'))

describe('charges', () => {
  beforeEach(resetDatabase)

  goodCharges.forEach((good, i) => {
    describe('ChargesSchema good docs', () => {
      it(`Succeeds on GOOD Charges insert ${i + 1}`, () => {
        expect(() => Charges.insert(good)).not.to.throw()
      })
    })

    describe('query database good event', () => {
      it('success if database query matches', () => {
        const id = Charges.insert(good)
        const thing = Charges.findOne(id)
        expect(thing._id).to.equal(good._id)
        // Templated replacement...
        const fields = ["token","success","amount","currency","description","email","ip_address","created_at","status_message","error_message","card","transfer","amount_refunded","total_fees","merchant_entitlement","refund_pending","authorisation_expired","captured","captured_at","settlement_currency","active_chargebacks","metadata"] || []
        fields.forEach(field => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })

    badCharges.forEach((bad, i) => {
      describe('ChargesSchema bad parts', () => {
        it(`Succeeds on BAD Charges insert ${i + 1}`, () => {
          expect(() => Charges.insert(bad)).to.throw()
        })
      })
    })
  })
})
