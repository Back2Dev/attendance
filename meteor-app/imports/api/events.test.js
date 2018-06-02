/* eslint-disable no-unused-expressions */
// schema.test.js
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Mongo } from 'meteor/mongo'
import { expect } from 'chai'
import sinon from 'sinon'

import { resetDatabase } from '/imports/test/util-test'
import { createdAt, updatedAt, mustEqualOneOf } from '/imports/api/schema'
import Events from '/imports/api/events'

const goodOnes = [
  { who: 'Mikey Mike', what: 'Did something', where: 'Over here' },
  { who: 'Mikey Mike', what: 'Did something', where: 'Over here', data: "Something" },
  { who: 'Mikey Mike', what: 'Did something', where: 'Over here', data: { name: "Something" } },
]

const badOnes = [
  { name: 'Mikey Mike', what: 'Did something', where: 'Over here' },
  { who: 'Mikey Mike', where: 'Over here', data: "Something" },
  { who: 'Mikey Mike', what: 'Did something', where: 'Over here', data: 88 },
]

describe.only('api/events collection', () => {
  beforeEach(resetDatabase)

  describe('insertions', () => {

    it('Inserts an event', () => {
      goodOnes.forEach(item => {
        let id;
        expect(() => id = Events.insert(item)).to.not.throw()
        expect(id).to.be.ok
        const doc = Events.findOne(id)
        expect(doc.createdAt).to.be.a('date')        
        // expect(doc.updatedAt).to.be.a('date')        
      })
    })

    it('Fails to insert an event', () => {
      badOnes.forEach(item => {
        expect(() => Events.insert(item)).to.throw()
      })
    })


  })


})
