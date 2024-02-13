import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { randomId } from './random'

describe('Miscellaneous utils', () => {
  // beforeEach(function () {})

  describe('generate ids', () => {
    it('should generate a 17 character random id', () => {
      const id = randomId()
      expect(id.length).to.equal(17)
    })
    it('should generate a 25 character random id', () => {
      const id = randomId(25)
      expect(id.length).to.equal(25)
    })
    it('should generate 10 unique random ids', () => {
      const ids = '1 2 3 4 5 6 7 8 9 10'.split(/\s+/).map((i) => randomId())
      const matches = ids.reduce(
        (dupes, id, ix) => (ids.includes(id) ? dupes + 1 : dupes),
        0
      )
      // Each id should appear just once in the array
      expect(matches).to.equal(ids.length)
    })
  })
})
