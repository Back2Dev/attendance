import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Courses from '/imports/api/courses/schema'

// const debug = require('debug')('b2b:factory:courses')

Factory.define('course', Courses, {
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
