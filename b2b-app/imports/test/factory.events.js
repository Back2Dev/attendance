import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Events from '/imports/api/events/schema'

Factory.define('event', Events, {
  name: 'Evening workshop',
  location: 'Back2bikes',
  when: new Date(),
  status: 'active',
  duration: 2,
  price: 200,
  type: 'monthly',
})

Factory.define('test-event', Events, {
  name: 'Squad training',
  location: 'Sandridge',
  when: new Date(),
  status: 'active',
  duration: 2,
  type: 'day',
  days: [1, 2, 3, 4, 5, 6, 7],
  price: 3000,
})
