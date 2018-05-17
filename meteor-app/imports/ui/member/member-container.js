import { Meteor } from 'meteor/meteor'
import {withTracker} from 'meteor/react-meteor-data';
import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';

// not sure if this is necessary if I search for person by id in user itself
// const UserContainer = createContainer((props) => {
//   const rolesHandle = Meteor.subscribe('everyone');
//   const loading = ! rolesHandle.ready();
  
//   const id = props.match.params.id;
//   // what has subscription got to do with this?
//   const user = Roles.findOne({ "_id": props.match.params.id });

//   return {
//     user
//   }
// }, User)

export default withTracker((props) => {

  const membersHandle = Meteor.subscribe('all.members')
  const loading = ! membersHandle.ready()
  return {
    membersIn: Members.find({isHere: true}).fetch(),
    membersOut: Members.find({isHere: false}).fetch(),
    loading
  }
})(MemberMain)