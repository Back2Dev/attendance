import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.events', 'Deleting', { id })
const update = (id, form) => {
  meteorCall('update.events', 'updating', { form: { ...form, _id: id } })
  push('/admin/events')
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <View {...props}></View>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.events', id)
  const item = Events.findOne(id) || {}
  return {
    id,
    item,
    remove,
    update,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
