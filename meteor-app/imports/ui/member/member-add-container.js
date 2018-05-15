import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import Members from '/imports/api/members/members';

export default withTracker((props) => {

  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()

  const onSubmit = () => {
    alert('submitted')
  }

  return {
    onSubmit,
  }
})(MemberAdd)