import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <View {...props}></View>
}
const Viewer = withTracker((props) => {
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.messageTemplates', id)
  const item = MessageTemplates.findOne(id) || {}
  return {
    item,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Viewer
