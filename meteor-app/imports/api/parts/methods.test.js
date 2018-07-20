import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Parts from '/imports/api/parts/schema'
import '/imports/api/parts/methods'
import Factory from '/imports/test/factories'
import { resetDatabase } from '/imports/test/util-test'


const goodPart = Factory.build('part')

if (Meteor.isServer) {
  // beforeEach(resetDatabase)
  describe('test methods for inserting part', () => {

    it('parts.insert method is successful', () => {
      expect(() => Meteor.call('parts.insert', goodPart)).to.not.throw()
    })
    console.log(goodPart)
  })
}