import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from 'react-s-alert';
const debug = require('debug')('att:admin')
import { escapeRegExp } from 'lodash'

import Admin from "/imports/ui/admin/admin";
import Members from '/imports/api/members/members';
import {eventLog} from '/imports/api/events'
import {saveToArchive} from '/imports/api/archive'

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()

  const filter = (query) => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(escapeRegExp(query)), $options: 'i' },
      }
    } else {
      return { }
    }
  }
  const uploadXL = (e) => {
    e.preventDefault();

    const file = e.target[0].files[0];
    const msg = file
      ? `Adding your parts`
      : `Oops! Forgot to add the file? Try again uploading the file`;
    Alert.info(msg);
    const reader = new FileReader();
    reader.onloadend = function() {
      const data = reader.result;
      Meteor.callAsync("parts.load", data);
    };
    reader.readAsBinaryString(file);
  }
  const members = Members.find(
    filter(Session.get('searchQuery')), {
      sort: {
        sessionCount: -1,
      },
    },
  ).fetch()

  const removeMember = async (id) => {
    const member =  Members.findOne(id);
    eventLog({
      who: 'Admin',
      what: `removed member id: ${id}`,
      object: member
    })
    saveToArchive("member", member)
    Meteor.call('members.remove', id, (err, res) => {
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
    uploadXL,
  }
})(Admin)