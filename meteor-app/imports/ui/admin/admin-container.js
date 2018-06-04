import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from 'react-s-alert';
const debug = require('debug')('att:admin')

import Admin from "/imports/ui/admin/admin";
import Members from '/imports/api/members/members';
export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const members = Members.find({}, { sort: { sessionCount: -1 } }).fetch()

  const removeMember = (memberId) => {
    Meteor.call('members.remove', memberId, (err, res) => {
      if (err) {
        Alert.error('error whilst removing member');
      } else {
        Alert.success(`successfully removed ${res} member`);
      }
    })
  }

  return {
    loading,
    members,
    removeMember,
  }
})(Admin)