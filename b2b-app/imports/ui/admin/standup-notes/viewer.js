import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import StandupNotes from '/imports/api/standup-notes/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'

const Viewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.standup-notes', id)
    return {
      loading: !subsHandle.ready(),
      item: StandupNotes.findOne(id) || {},
    }
  }, [id])

  const { remove, update } = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.standup-notes', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.standup-notes', 'updating', { id: targetId, form })
        navigate('/admin/standup-notes')
      },
    }),
    [navigate]
  )

  if (loading) return <Loader loading />
  return <View id={id} item={item} remove={remove} update={update} loading={loading} />
}

export default Viewer
