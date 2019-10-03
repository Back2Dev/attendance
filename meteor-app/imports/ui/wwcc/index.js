import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from 'react-s-alert'
import { escapeRegExp } from 'lodash'

import Admin from './admin'
import Members from '/imports/api/members/schema'
import { eventLog } from '/imports/api/eventlogs'

const debug = require('debug')('b2b:admin')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Admin {...props} />
}

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('all.members') //???
  const loading = !membersHandle.ready()

  const filter = query => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(escapeRegExp(query)), $options: 'i' }
      }
    } else {
      return {}
    }
  }

  const members = Members.find(filter(Session.get('searchQuery')), {
    sort: {
      sessionCount: -1
    }
  }).fetch()

  const memberWord = Meteor.settings.public.member || 'Volunteer'
  const memberWords = memberWord + 's'

  const checkWwcc = async (id, wwcc, name) => {
    try {
      const result = await Meteor.callAsync('members.checkWwcc', id, wwcc, name)
      Alert.success(result)
      eventLog({
        who: 'Admin',
        what: `checked wwcc for: ${id}`
      })
    } catch (e) {
      Alert.error(e.message)
    }
  }

  return {
    loading,
    members,
    memberWords,
    checkWwcc
  }
})(Loader)
