import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'

const debug = require('debug')('se:adder')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
let push
const defaultObject = {
  name: 'Untitled',
  slug: 'untitled',
  type: 'SMS',
  body: 'Re: *|address|*\nNew message',
  subject: 'Your property',
}

const methods = {
  save: (form) => {
    meteorCall('insert.messageTemplates', 'updating', form)

    push('/admin/message-templates')
  },
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <Add {...props}></Add>
}
const Adder = withTracker((props) => {
  let loading = false
  let item
  const id = props.match.params.id
  if (id) {
    const subsHandle = Meteor.subscribe('idslug.messageTemplates', id)
    loading = !subsHandle.ready()
    let query = id
    if (!MessageTemplates.findOne(id)) query = { slug: id }
    item = MessageTemplates.findOne(query) || {}
    if (item._id) {
      item.oldSlug = item.slug
      item.slug = item.slug + '-copy'
      if (item.name) item.name = 'Copy of ' + item.name
      delete item._id
    }
  } else {
    item = defaultObject
  }
  return {
    item,
    methods,
    loading,
  }
})(Loading)
export default Adder
