import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import MyCollection from '/imports/api/my-collection/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('se:viewer')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.my-collection', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.my-collection', 'updating', { id, form })
  push('/admin/my-collection')
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <View {...props}></View>
}
const Tracker = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.my-collection', id)
  const item = MyCollection.findOne(id) || {}
  return {
    id,
    item,
    remove,
    update,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
