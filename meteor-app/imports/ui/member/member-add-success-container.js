import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import MemberAddSuccess from '/imports/ui/member/member-add-success'
import Members from '/imports/api/members/schema'

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)
  const message =
    Meteor.settings.public.welcome ||
    'When you first visit, say hello to someone on the team. They will give you a tour of the place, and help you find your avatar on the attendance app, where you can sign in.'

  return {
    loading,
    member,
    message
  }
})(MemberAddSuccess)
