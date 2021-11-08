import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Courses from '/imports/api/courses/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.courses', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.courses', 'updating', { id, form })
  push('/admin/courses')
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <View {...props}></View>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.courses', id)
  const item = Courses.findOne(id) || {}
  return {
    id,
    item,
    remove,
    update,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
