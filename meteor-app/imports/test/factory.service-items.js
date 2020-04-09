import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import ServiceItems from '/imports/api/service-items/schema'

Factory.define('parts', ServiceItems, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price() * 100),
  code: 'F',
  category: 'Other',
  used: false
})
