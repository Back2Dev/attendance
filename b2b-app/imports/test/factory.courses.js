import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Courses from '/imports/api/courses/schema'

Factory.define('course', Courses, {
  title: faker.lorem.sentence(),
  map: [
    { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
    { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
  ],
  description: faker.lorem.sentence(),
  difficulty: 'beginner',
  active: true,
})
