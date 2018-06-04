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
    try {
      Meteor.call('members.remove', memberId, (err, res) => {
        debug({ err })
        debug({ res })
        if (res != undefined) {
          Alert.success('successfully removed member');

        }
      })
    } catch (err) {
      alert('error')
    }

  }

  // const addMember = (formData) => {
  //   return Meteor.call('members.insert', formData, (err, res) => {
  //     if (err) {
  //       error.set(true)
  //       success.set(false)
  //       msg.set(err.reason)
  //     }
  //     if (!err && res != undefined) {
  //       success.set(true)
  //       newId.set(res)
  //       error.set(false)
  //       msg.set('Successfully added new volunteer')
  //     }
  //   })
  // }



  return {
    loading,
    members,
    removeMember,
  }
})(Admin)