import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Bookings from '/imports/api/bookings/schema'

Factory.define('session', Bookings, {
  name: faker.lorem.words(3),
  bookedAt: new Date(),
})
