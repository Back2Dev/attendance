import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import RoleRegister from '/imports/ui/components/roles-main/role-register'
import Roles from '/imports/api/roles/roles';

export default withTracker((props) => {
  const rolesHandle = Meteor.subscribe('all.roles')
  const loading = !rolesHandle.ready()
  const id = props.match.params.id;
  const role = Roles.findOne({ "_id": id })

  function recordAttendance() {
    if (!role.isHere) {
      Meteor.call('signin', id);
    } else {
      Meteor.call('signout', id)
    }
  }

  return {
    recordAttendance,
    loading,
    role,
  }
})(RoleRegister)