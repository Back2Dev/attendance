import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'

const Viewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.service-items', id)
    return {
      loading: !subsHandle.ready(),
      item: ServiceItems.findOne(id) || {},
    }
  }, [id])

  const { remove, update } = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.service-items', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.service-items', 'updating', { id: targetId, form })
        navigate('/admin/service-items')
      },
    }),
    [navigate]
  )

  if (loading) return <div>Loading...</div>
  return <View id={id} item={item} remove={remove} update={update} loading={loading} />
}

export default Viewer
