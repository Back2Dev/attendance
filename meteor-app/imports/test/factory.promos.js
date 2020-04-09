import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Promos from '/imports/api/promos/schema'

Factory.define('promo', Promos, {
  code: 'BLACK-FRIDAY',
  description: 'Black Friday 50% off',
  discount: 50,
  admin: false,
  start: new Date()
})
