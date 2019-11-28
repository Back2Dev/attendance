import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import '/imports/api/parts/methods'
import Factory from '/imports/test/factories'

const goodPart = Factory.build('part')

if (Meteor.isServer) {
  describe('test methods for inserting part', () => {
    it('parts.insert method is successful', () => {
      expect(() => Meteor.call('parts.insert', goodPart)).to.not.throw()
      expect(goodPart).to.be.a('object')
    })

    it('should contain required keys: imageUrl,retailPrice,wholesalePrice and partNo', () => {
      expect(goodPart).to.contain.keys('_id', 'imageUrl', 'retailPrice', 'wholesalePrice', 'partNo')
    })
  })
}
