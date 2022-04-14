import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Teams from '/imports/api/teams/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import Meeting from './meeting'

const debug = require('debug')('app:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.teams', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.teams', 'updating', { id, form })
  push('/admin/teams')
}

const save = (form) => {
  Meteor.call('insert.standups', form)
  push(`/admin/standups/save/${id}`)
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <Loader loading />
  return <Meeting {...props}></Meeting>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.teams', id)
  const item = Teams.findOne(id) || {}
  return {
    teamName: item.name,
    save,
    people: item.devs?.map((dev) => {
      return { name: dev }
    }),

    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
