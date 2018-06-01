import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import MemberAddSuccess from '/imports/ui/member/member-add-success'
import Members from '/imports/api/members/members'

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)
  
  return {
    loading,
    member,
  }
})(MemberAddSuccess)