import { expect } from 'chai'
import { resetDatabase } from '/imports/test/util-test'
import resultsCache from './results-cache'

const debug = require('debug')('app:results-cache-test')

describe('Results cache', () => {
  resetDatabase()
  const cache = resultsCache.INIT('Result run')
  // Do something and get a value
  const v1 = '345'
  cache.expecting('First one (fail)', v1, 'ne', '123')

  // Do something and get another value
  const v2 = '345'
  cache.expecting('2nd one (success)', v2, 'equal', '345')

  // Do something and get another value
  const v3 = 'HeLLo'
  cache.expecting('3rd one (success)', v3, 'match', /hell/i)

  // Now run through the  results, telling Mocha about it

  cache.showResults()
})
