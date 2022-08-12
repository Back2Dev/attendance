import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Schemas from '/imports/api/schemas/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.schemas', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.schemas', 'updating', { id, form })
  push('/admin/schemas')
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <Loader loading />
  return <View {...props}></View>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.schemas', id)
  const item = Schemas.findOne(id) || {}
  return {
    id,
    item,
    remove,
    update,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
