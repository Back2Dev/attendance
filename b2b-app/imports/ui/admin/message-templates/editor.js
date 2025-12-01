import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './edit'

const debug = require('debug')('app:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.messageTemplates', id)
    return {
      loading: !subsHandle.ready(),
      item: MessageTemplates.findOne(id) || {},
    }
  }, [id])

  const methods = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.messageTemplates', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.messageTemplates', 'updating', form)
        navigate('/admin/message-templates')
      },
    }),
    [navigate]
  )

  if (loading) return <div>Loading...</div>
  return <Edit id={id} item={item} methods={methods} loading={loading} />
}

export default Editor
