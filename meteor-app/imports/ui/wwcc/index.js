import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from 'react-s-alert'
import { escapeRegExp } from 'lodash'
import moment from 'moment'

import Admin from './admin'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'
import { eventLog } from '/imports/api/eventlogs'
import { saveToArchive } from '/imports/api/archive'
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

  const checkWwcc = async id => {
    Meteor.call('members.checkWwcc', id, (err, res) => {
      if (err) {
        Alert.error('error whilst checking member wwcc')
      } else {
        Alert.success(`successfully checked ${res} member wwcc`)
        eventLog({
          who: 'Admin',
          what: `checked wwcc for: ${id}`
        })
      }
    })
  }

  return {
    loading,
    members,
    memberWords,
    checkWwcc
  }
})(Loader)
