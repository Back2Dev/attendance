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

const methods = {  save: ( form) => {
  meteorCall('insert.messageTemplates', 'updating', form)

  push('/admin/message-templates')
} }

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <Add {...props}></Add>
}
const Adder = withTracker((props) => {
  const item = {
  name: 'Untitled',
  slug: 'untitled',
  type: 'SMS',
  body: 'Re: *|address|*\nNew message',
  subject: 'Your property',
}
  return {
    item,
    methods,
    loading: false,
  }
})(Loading)
export default Adder
