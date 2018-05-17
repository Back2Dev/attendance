import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';


export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const membersIn = Members.find({ isHere: true }).fetch()
  const membersOut = Members.find({ isHere: false }).fetch()
  
  // const membersSearchHandle = Meteor.subscribe('members.search', 'maude')

  // const search = () => {
  // }

  return {
    membersIn,
    membersOut,
    loading,
  }
})(MemberMain)