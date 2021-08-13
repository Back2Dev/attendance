import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { meteorCall } from '/imports/ui/utils/meteor'
import Transporter from './transporter'
import MessageTemplates from '/imports/api/message-templates/schema'
import { showSuccess } from '/imports/ui/utils/toast-alerts'

const debug = require('debug')('se:transporter-box')

const sendEmail = async (params) => {
  const message = {
    type: 'email',
    to: params.recipient,
    subject: params.template_name,
    body: params.body,
    data: {
      html: params.body,
      subject: params.template_name,
      from_email: 'do-not-reply@mydomain.com.au', // TODO - Use a personal email
      from_name: 'Back2bikes.',
      to: [
        {
          email: params.recipient,
          name: params.nickname || 'Nick',
          type: 'to',
        },
      ],
    },
  }
  const result = await meteorCall('insert.messages', null, message)
  if (result.status === 'success') {
    showSuccess('successfully added test email')
  }
}

const sendSMS = async (params) => {
  const message = {
    type: 'sms',
    to: params.to,
    subject: params.template_name,
    body: params.body,
    data: {
      recipient: params.to,
      sender: params.from,
      message: params.body,
    },
  }
  const result = await meteorCall('insert.messages', null, message)
  if (result.status === 'success') {
    showSuccess('successfully added test sms')
  }
}

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <Transporter {...props}></Transporter>
}

const Tracker = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.messageTemplates')
  const messages = MessageTemplates.find({}, { sort: { number: 1 } }).fetch()
  return {
    messages,
    sendEmail,
    sendSMS,
    loading: !subsHandle.ready(),
  }
})(Loading)

export default Tracker
