import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Products from '/imports/api/products/schema'

Factory.define('10pass', Products, {
  name: '10 pass',
  description: 'Passes allow you to use PA',
  type: 'pass',
  code: 'PA-PASS-MULTI-10',
  duration: 3,
  price: 15000,
  image: '/public/images/gym.jpg',
  active: true,
  autoRenew: true,
  startDate: faker.date.past(1),
  endDate: faker.date.future(1)
})
