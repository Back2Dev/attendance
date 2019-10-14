import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { escapeRegExp } from 'lodash'
import Alert from 'react-s-alert'

import Admin from './admin'
import Members from '/imports/api/members/schema'
import { eventLog } from '/imports/api/eventlogs'

const debug = require('debug')('b2b:admin')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Admin {...props} />
}

const uploadSLSAFile = (e) => {
  e.preventDefault()

  const file = e.target[0].files[0]
  const msg = file ? `Processing member history file` : `Oops! Forgot to add the file? Try again uploading the file`
  Alert.info(msg)
  const reader = new FileReader()
  reader.onloadend = async function () {
    const data = reader.result
    const response = await Meteor.callAsync('slsa.load', data)
    debug('Response is ', response)
  }
  reader.readAsBinaryString(file)
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

  return {
    loading,
    members,
    memberWords,
    uploadMethod: uploadSLSAFile
  }
})(Loader)
