import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'

import { expect } from 'chai'

import './methods.custom'

const debug = require('debug')('b2b:messages:test')

// Tests start here

// prepare data for testing

describe('Test member methods', () => {
  before(() => {
    resetDatabase()
  })
})
