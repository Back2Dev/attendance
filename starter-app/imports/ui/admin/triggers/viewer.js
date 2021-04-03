import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Triggers from '/imports/api/triggers/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('se:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.triggers', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.triggers', 'updating', { id, form })
  push('/admin/triggers')
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <View {...props}></View>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.triggers', id)
  const item = Triggers.findOne(id) || {}
  return {
    id,
    item,
    remove,
    update,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
