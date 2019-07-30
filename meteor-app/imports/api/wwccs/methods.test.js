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

    it('should contain required keys: imageUrl,retailPrice,wholesalePrice and partNo', () => {
      expect(goodWwcc).to.contain.keys('_id', 'memberId', 'wwcc', 'surname')
    })
  })
}
