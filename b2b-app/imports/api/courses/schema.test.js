import { expect } from 'chai'
import faker from 'faker'

import Courses from './schema'

export const goodCourses = [
  {
    title: faker.lorem.sentence(),
    map: [
      { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
      { title: faker.address.city(), imageUrl: faker.image.imageUrl() },
    ],
    description: faker.lorem.sentence(),
    difficulty: 'beginner',
    active: true,
  },
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    difficulty: 'intermediate',
    active: true,
  },
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
  },
  {
    title: faker.lorem.sentence(),
  },
]

export const badCourses = [
  {
    // empty
  },
  {
    map: 'string',
    difficulty: 'invalid value',
  },
]

describe.only('Courses Schema', () => {
  describe('Check good courses', () => {
    goodCourses.map((item) => {
      it(`Should success on good courses insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Courses.insert(item)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Courses.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad courses', () => {
    badCourses.map((item) => {
      it(`Should fail on bad courses insert ${item.title || ''}`, () => {
        expect(() => {
          Courses.insert(item)
        }).to.throw()
      })
    })
  })
})
