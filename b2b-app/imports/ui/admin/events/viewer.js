import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'

const Viewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.events', id)
    return {
      loading: !subsHandle.ready(),
      item: Events.findOne(id) || {},
    }
  }, [id])

  const { remove, update } = useMemo(() => {
    return {
      remove: (targetId) => meteorCall('rm.events', 'Deleting', { id: targetId }),
      update: (targetId, form) => {
        meteorCall('update.events', 'updating', { form: { ...form, _id: targetId } })
        navigate('/admin/events')
      },
    }
  }, [navigate])

  if (loading) return <div>Loading...</div>
  return <View id={id} item={item} remove={remove} update={update} loading={loading} />
}

export default Viewer
