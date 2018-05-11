import { Meteor } from 'meteor/meteor'
import {withTracker} from 'meteor/react-meteor-data';
import RolesMain from '../components/roles-main'
import Roles from '/imports/api/roles/roles';

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

  const rolesHandle = Meteor.subscribe('all.roles')
  const loading = ! rolesHandle.ready()

  return {
    rolesIn: Roles.find({isHere: true}).fetch(),
    rolesOut: Roles.find({isHere: false}).fetch(),
  }
})(RolesMain)