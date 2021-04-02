import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './edit'

const debug = require('debug')('se:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
let push

const remove = (id) => meteorCall('rm.messageTemplates', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.messageTemplates', 'updating', form)

  push('/admin/message-templates')
}
const methods = { remove, update }

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <Edit {...props}></Edit>
}
const Editor = withTracker((props) => {
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.messageTemplates', id)
  const item = MessageTemplates.findOne(id) || {}
  return {
    id,
    item,
    methods,
    loading: !subsHandle.ready(),
  }
})(Loading)
export default Editor
