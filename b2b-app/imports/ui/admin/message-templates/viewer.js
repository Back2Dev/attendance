import { Meteor } from 'meteor/meteor'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import MessageTemplates from '/imports/api/message-templates/schema'
import View from './view'

const Viewer = () => {
  const { id } = useParams()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.messageTemplates', id)
    return {
      loading: !subsHandle.ready(),
      item: MessageTemplates.findOne(id) || {},
    }
  }, [id])

  if (loading) return <div>Loading...</div>
  return <View item={item} loading={loading} />
}

export default Viewer
