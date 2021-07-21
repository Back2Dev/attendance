import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Triggers from '/imports/api/triggers/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './edit'

const debug = require('debug')('se:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
let history

const remove = (id) => meteorCall('rm.triggers', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.triggers', 'updating', form)
  history.push('/admin/triggers')
}
const methods = { remove, update }

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <Edit {...props}></Edit>
}
const Editor = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.triggers', id)
  const item = Triggers.findOne(id) || {}
  return {
    id,
    item,
    methods,
    loading: !subsHandle.ready(),
  }
})(Loading)
export default Editor
