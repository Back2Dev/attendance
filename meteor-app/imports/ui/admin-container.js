import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Admin from "/imports/ui/admin";

export default withTracker((props) => {
  // const membersHandle = Meteor.subscribe('all.members')
  // const loading = !membersHandle.ready()
  // const id = props.match.params.id
  // const member = Members.findOne(id)
  
  return {
    // loading,
    // member,
  }
})(Admin)