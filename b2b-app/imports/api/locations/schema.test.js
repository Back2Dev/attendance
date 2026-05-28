import { expect } from 'chai'
import faker from 'faker'

import Locations from './schema'

export const goodLocations = [
  {
    title: faker.lorem.sentence(),
    slug: 'COURSE-1',
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
    slug: 'COURSE-2',
    description: faker.lorem.sentence(),
    difficulty: 'intermediate',
    active: true,
  },
  {
    title: faker.lorem.sentence(),
    slug: 'COURSE-3',
    description: faker.lorem.sentence(),
  },
  {
    title: faker.lorem.sentence(),
    slug: 'COURSE-4',
  },
]

export const badLocations = [
  {
    // empty
  },
  {
    map: 'string',
    difficulty: 'invalid value',
  },
]

describe('Locations Schema', () => {
  describe('Check good locations', () => {
    goodLocations.map((item) => {
      it(`Should success on good locations insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Locations.insert(item)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Locations.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad locations', () => {
    badLocations.map((item) => {
      it(`Should fail on bad locations insert ${item.title || ''}`, () => {
        expect(() => {
          Locations.insert(item)
        }).to.throw()
      })
    })
  })
})
