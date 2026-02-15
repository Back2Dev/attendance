// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Workflows from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.workflows'

const badWorkflows = [
  // no name
  {},
]

const goodWorkflows = []

// goodWorkflows.push(Factory.build('workflows'))

describe('workflows', () => {
  goodWorkflows.map((good, i) => {
    describe('query database good workflow', () => {
      // resetDatabase()
      it('success if database query matches', async () => {
        const id = await Workflows.insertAsync(good)
        const thing = await Workflows.findOneAsync(id)
        expect(thing._id).to.equal(good._id)
        // Templated replacement...
        const fields =
          ['_id', 'listingId', 'customerId', 'conveyancerId', 'agentId', 'brokerId'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badWorkflows.map((bad, i) => {
    describe('WorkflowsSchema bad workflow', () => {
      it(`Succeeds on BAD Workflows insert ${i + 1}`, async () => {
        try {
          await Workflows.insertAsync(bad)
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
        }
      })
    })
  })
})
