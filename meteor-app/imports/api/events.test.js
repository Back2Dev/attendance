/* eslint-disable no-unused-expressions */
// schema.test.js
import { Mongo } from 'meteor/mongo'
import { expect } from 'chai'
import sinon from 'sinon'

import { resetDatabase } from '/imports/test/util-test'
import { createdAt, updatedAt, mustEqualOneOf } from '/imports/api/schema'
import Events from '/imports/api/events'

const goodOnes = [
  { description: 'Basic',
    who: 'Mikey Mike', what: 'Did something', where: 'Over here' },
  { description: 'object data',
    who: 'Mikey Mike', what: 'Did something', where: 'Over here', object: { name: "Something" } },
]

const badOnes = [
  { description: 'Missing who',
    name: 'Mikey Mike', what: 'Did something', where: 'Over here' },
  { description: 'Missing what',
    who: 'Mikey Mike', where: 'Over here', object: "Something" },
  { description: 'string data',
    who: 'Mikey Mike', what: 'Did something', where: 'Over here', object: "Something" },
  { description: 'Data is a number',
    who: 'Mikey Mike', what: 'Did something', where: 'Over here', object: 88 },
]

describe('api/events collection', () => {
  beforeEach(resetDatabase)

  describe('insertions', () => {

    goodOnes.forEach(item => {
      it(`Inserts an event [${item.description}]`, () => {
        let id;
        expect(() => id = Events.insert(item)).to.not.throw()
        expect(id).to.be.ok
        const doc = Events.findOne(id)
        expect(doc.createdAt).to.be.a('date')        
        // expect(doc.updatedAt).to.be.a('date')        
      })
    })

    badOnes.forEach(item => {
      it(`Fails to insert an event [${item.description}]`, () => {
        expect(() => Events.insert(item)).to.throw()
      })
    })


  })


})
