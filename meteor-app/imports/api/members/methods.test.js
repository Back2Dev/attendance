import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
// import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import '/imports/api/members/methods'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'

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
}
