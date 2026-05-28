import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Locations from '/imports/api/locations/schema'

// const debug = require('debug')('app:factory:locations')

Factory.define('location', Locations, {
  title: faker.lorem.sentence(),
  slug: faker.random.alphaNumeric(32),
  map: [
    { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
    { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
  ],
  description: faker.lorem.sentence(),
  difficulty: 'beginner',
  active: true,
})
