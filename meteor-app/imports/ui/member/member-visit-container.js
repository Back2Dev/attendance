import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import MemberVisit from '/imports/ui/components/member/member-visit'
import Members from '/imports/api/members/members'

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)

  function recordVisit() {
    if (!member.isHere) {
      Meteor.call('arrive', id)
    } else {
      Meteor.call('depart', id)
    }
  }

  return {
    recordVisit,
    loading,
    member,
  }
})(MemberVisit)