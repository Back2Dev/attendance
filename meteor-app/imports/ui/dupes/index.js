import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import { escapeRegExp } from 'lodash'

import Members, { Dupes } from '/imports/api/members/schema'
import Admin from './dupes'
const debug = require('debug')('b2b:admin')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Admin {...props} />
}

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('members.dupes')
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
      name: 1,
      sessionCount: -1
    }
  }).fetch()

  const dupes = Dupes.find({ value: { $gt: 1 } }).fetch()

  const memberWord = Meteor.settings.public.member || 'Volunteer'
  const memberWords = memberWord + 's'

  const removeDupe = async (id, merge) => {
    Meteor.call('members.removeDupe', id, merge)
    if (merge) Alert.success(`Successfully merged members`)
    else Alert.success(`Successfully removed member`)
  }

  const refresh = () => {
    Meteor.call('members.showDupes')
  }

  return {
    loading,
    members,
    dupes,
    removeDupe,
    refresh
  }
})(Loader)
