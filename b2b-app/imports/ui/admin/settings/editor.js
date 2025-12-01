import { Meteor } from 'meteor/meteor'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Settings from '/imports/api/settings/schema'
import Edit from './edit'

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.settings', id)
    return {
      loading: !subsHandle.ready(),
      item: Settings.findOne(id) || {},
    }
  }, [id])

  const save = (form) => {
    Meteor.call('update.Settings', form)
    navigate('/admin/settings')
  }
  const cancel = () => navigate('/admin/settings')

  return <Edit item={item} loading={loading} save={save} cancel={cancel} />
}

export default Editor
