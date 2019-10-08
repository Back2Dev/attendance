import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import '/imports/api/wwccs/methods'
import Factory from '/imports/test/factories'

const goodWwcc = Factory.build('wwcc')

if (Meteor.isServer) {
  describe('test methods for inserting wwcc', () => {
    it('wwccs.insert method is successful', () => {
      expect(() => Meteor.call('wwccs.insert', goodWwcc)).to.not.throw()
      expect(goodWwcc).to.be.a('object')
    })

    const keylist = '_id, memberId, wwcc, wwccSurname'
    it(`should contain required keys: ${keylist}`, () => {
      expect(goodWwcc).to.contain.keys(keylist.split(/,\s*/g))
    })
  })
}
