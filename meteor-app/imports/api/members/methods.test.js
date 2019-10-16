import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import '/imports/api/members/methods'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'

import slsaData, { currentNames } from '/imports/test/slsa.sample'

const goodMember = Factory.build('member')
const goodSession = Factory.build('session', { memberId: goodMember._id })

if (Meteor.isServer) {
  describe('API methods for members collection', () => {
    // beforeEach(resetDatabase)

    it('members.insert and members.remove method will work', () => {
      expect(() => Meteor.call('members.insert', goodMember)).to.not.throw()
      const id = Members.find({ name: goodMember.name }).fetch()[0]._id
      expect(() => Meteor.call('members.remove', id)).to.not.throw()
      expect(() => Meteor.call('members.remove', id)).to.throw()
    })

    it('members.remove method will remove sessions', () => {
      expect(() => Members.insert(goodMember)).to.not.throw()
      expect(() => Sessions.insert(goodSession)).to.not.throw()
      const id = Members.find({ name: goodMember.name }).fetch()[0]._id
      let sid = Sessions.find({ memberId: goodMember._id }).fetch()[0]._id
      expect(() => sid.to.be.ok())
      expect(() => Meteor.call('members.remove', id)).to.not.throw()
      sid = Sessions.find({ memberId: id }).fetch()
      expect(() => sid.to.not.be.ok())
    })
  })

  //
  // Check the upload processing for SLSA membership data
  // It uses the test data itself (unpacked using a function in the test data)
  // To calculate how many members should be updat ed.
  //
  describe('upload processing', () => {
    it('slsa.load imports and updates 2 recorda', () => {
      resetDatabase()
      let n = 0
      const season = '2019/2020'
      const m = currentNames(season).map(name => {
        delete goodMember._id
        goodMember.name = name
        expect(() => Members.insert(goodMember)).to.not.throw()
        return name
      }).length
      expect(() => {
        n = Meteor.call('slsa.load', slsaData, season)    // Call returns the number of records updated
      }).to.not.throw()
      expect(n).to.be.equal(m)
    })

  })
}
