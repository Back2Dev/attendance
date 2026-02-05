import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Courses from '/imports/api/courses/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'

const Viewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.courses', id)
    return {
      loading: !subsHandle.ready(),
      item: Courses.findOne(id) || {},
    }
  }, [id])

  const { remove, update } = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.courses', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.courses', 'updating', { id: targetId, form })
        navigate('/admin/courses')
      },
    }),
    [navigate]
  )

  if (loading) return <div>Loading...</div>
  return <View id={id} item={item} remove={remove} update={update} loading={loading} />
}

export default Viewer
