import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Rentals from '/imports/api/rentals/schema'

Factory.define('rentals', Rentals, {})
