import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import RoleRegister from '../components/roles-main/role-register'
import Roles from '/imports/api/roles/roles';
import Attendances from '/imports/api/attendances/attendances';

export default withTracker((props) => {
  const rolesHandle = Meteor.subscribe('all.roles')
  const loading = !rolesHandle.ready()
  const id = props.match.params.id;
  const role = Roles.findOne({ "_id": id })
  
  function recordAttendance(){
    if(role.checkedin){
      Meteor.call('attendance.signout', id);
      Meteor.call('role.checkout', id)
    } else {
      Meteor.call('attendance.signin', id)
      Meteor.call('role.checkin', id)
    }
  }

  return {
    recordAttendance,
    loading,
    role,
  }
})(RoleRegister)