// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import Promos from './schema'
import Factory from '/imports/test/factories'

const okPromo = {
  code: 'RANDOM',
  description: 'A random promo',
  admin: false,
  discount: 20,
  start: new Date()
}

let badPromos = []
const omit = 'code description admin discount start'
badPromos = omit.split(/\s+/).map(element => {
  delete cloneDeep(okPromo)[element]
})

const goodPromos = [okPromo]

goodPromos.push(Factory.build('promo'))

describe('promos', () => {
  beforeEach(resetDatabase)

  goodPromos.forEach((good, i) => {
    describe('PromosSchema good promos', () => {
      it(`Succeeds on GOOD Promos insert ${i + 1}`, () => {
        expect(() => Promos.insert(good)).not.to.throw()
      })
    })

    describe('query database good promo', () => {
      it('success if database query matches', () => {
        const promoId = Promos.insert(good)
        const promo = Promos.findOne(promoId)

        expect(promo._id).to.equal(good._id)
        const fields = 'memberId productId price productName'.split(/\s+/)
        fields.forEach(field => {
          expect(promo[field]).to.equal(good[field])
        })
      })
    })

    badPromos.forEach((bad, i) => {
      describe('PromosSchema bad parts', () => {
        it(`Fails on BAD Promos insert ${i + 1}`, () => {
          expect(() => Promos.insert(bad)).to.throw()
        })
      })
    })
  })
})
