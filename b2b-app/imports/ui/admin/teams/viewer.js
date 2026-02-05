import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Teams from '/imports/api/teams/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import View from './view'

const debug = require('debug')('app:viewer')
const idField = '_id'

const Viewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.teams', id)
    return {
      loading: !subsHandle.ready(),
      item: Teams.findOne(id) || {},
    }
  }, [id])

  const { remove, update } = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.teams', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.teams', 'updating', { id: targetId, form })
        navigate('/admin/teams')
      },
    }),
    [navigate]
  )

  if (loading) return <Loader loading />
  return <View id={id} item={item} remove={remove} update={update} loading={loading} />
}

export default Viewer
