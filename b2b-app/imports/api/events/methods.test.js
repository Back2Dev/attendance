// import { Meteor } from 'meteor/meteor'
// import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'

import './methods'

use(assertArrays)

const debug = require('debug')('b2b:events:test')
