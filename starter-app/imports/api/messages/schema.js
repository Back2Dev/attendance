import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
  OptionalString,
} from '/imports/api/utils/schema-util'

const Messages = new Mongo.Collection('messages')
if (Meteor.isServer) {
  Messages._ensureIndex(
    {
      status: 1,
    },
    { name: 'messages_status' }
  )
}

export const MessagesSchema = new SimpleSchema({
  _id: OptionalRegExId,

  type: {
    type: String,
    allowedValues: [
      'email',
      'sms',
      'webhook',
      'slack',
      'twitter',
      'skype',
      'chat',
      'app',
    ],
  },
  from: OptionalString,
  to: String,
  subject: String,
  body: String,
  template: OptionalString,
  listingId: OptionalRegExId,
  notificationId: OptionalRegExId,
  url: OptionalString,
  data: {
    type: Object,
    blackbox: true,
  },
  status: {
    type: String,
    allowedValues: ['ready', 'sending', 'queued', 'sent', 'failed', 'cancelled'],
    defaultValue: 'ready',
  },
  expDate: {
    // we don't want to send a outdated message
    type: Date,
    optional: true,
  },
  retries: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  nextRun: {
    type: Date,
    optional: true,
  },
  history: {
    type: Array,
    optional: true,
  },
  'history.$': {
    type: Object,
    blackbox: true,
  },
  priority: {
    type: SimpleSchema.Integer,
    min: 1,
    max: 10,
    defaultValue: 5,
  },
  read: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  readAt: {
    type: Date,
    optional: true,
  },
  createdAt,
  updatedAt,
  completedAt: {
    type: Date,
    optional: true,
  },
})

Messages.attachSchema(MessagesSchema)

export default Messages
