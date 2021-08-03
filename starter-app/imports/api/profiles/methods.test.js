import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'

import { expect } from 'chai'

import './methods.custom'

const debug = require('debug')('app:messages:test')

// Tests start here

// prepare data for testing

describe('Test profile methods', () => {
  before(() => {
    resetDatabase()
  })
})
