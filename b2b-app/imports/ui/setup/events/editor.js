import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './edit'

const debug = require('debug')('app:setup:editor')

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.events', id)
    return {
      loading: !subsHandle.ready(),
      item: Events.findOne(id) || {},
    }
  }, [id])

  const defaultWhen = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(9, 0, 0, 0)
    return d
  }, [])

  const methods = useMemo(() => ({
    remove: (targetId) => meteorCall('rm.events', 'Deleting', { id: targetId }),
    update: (targetId, form) => {
      meteorCall('update.events', 'updating', { form: { ...form, _id: targetId } })
      navigate('/setup/events')
    },
  }), [navigate])

  if (loading || !item._id) return <div>Loading...</div>
  const itemWithWhen = item.when ? item : { ...item, when: defaultWhen }
  return <Edit id={id} item={itemWithWhen} methods={methods} loading={loading} />
}

export default Editor
