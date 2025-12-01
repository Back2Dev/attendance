import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'

const debug = require('debug')('app:adder')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
const defaultObject = {
  name: 'Untitled',
  slug: 'untitled',
  type: 'SMS',
  body: 'Re: *|address|*\nNew message',
  subject: 'Your property',
}

const Adder = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    if (!id) {
      return { loading: false, item: defaultObject }
    }
    const subsHandle = Meteor.subscribe('idslug.messageTemplates', id)
    let query = id
    if (!MessageTemplates.findOne(id)) query = { slug: id }
    const found = MessageTemplates.findOne(query) || {}
    if (found._id) {
      found.oldSlug = found.slug
      found.slug = `${found.slug}-copy`
      if (found.name) found.name = `Copy of ${found.name}`
      delete found._id
    }
    return { loading: !subsHandle.ready(), item: found }
  }, [id])

  const methods = useMemo(
    () => ({
      save: (form) => {
        meteorCall('insert.messageTemplates', 'updating', form)
        navigate('/admin/message-templates')
      },
    }),
    [navigate]
  )

  if (loading) return <div>Loading...</div>
  return <Add item={item} methods={methods} loading={loading} />
}

export default Adder
