// methods-listing.test.js
import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import Workflows, { Jobs, Tasks, Stages } from '/imports/api/workflows/schema'
import Factory from '/imports/test/factories'
import { workflow2md } from './methods.export'
import './methods-plus'

const debug = require('debug')('app:workflows')

const slugs = [
  { name: 'toy-story', file: '/tests/fixtures/js-data/wf-test-toy-story.js' },
]

// Tests start here
describe('Worklow functions', () => {
  // resetDatabase({ excludedCollections })
})
