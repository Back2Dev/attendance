import { expect } from 'chai'

import Courses from './schema'

export const goodCourses = [
  {
    title: 'string',
    map: 'string',
    description: 'string',
    difficulty: 'string',
    status: 1,
  },
  {
    title: 'string',
    description: 'string',
    difficulty: 'string',
    status: 0,
  },
  {
    title: 'string',
    description: 'string',
  },
  {
    title: 'string',
  },
]

export const badCourses = [
  {
    // empty
  },
  {
    map: 'string',
    status: 0.5,
  },
]

describe('Courses Schema', () => {
  describe('Check good courses', () => {
    goodCourses.map((item) => {
      it(`Should success on good courses insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Courses.insert(item)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Courses.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad courses', () => {
    badCourses.map((item) => {
      it(`Should fail on bad courses insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = insertedId = Courses.insert(item)
        }).to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Courses.remove({ _id: insertedId })
        }
      })
    })
  })
})
