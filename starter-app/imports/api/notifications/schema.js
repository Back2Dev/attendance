import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
  OptionalString,
} from '/imports/api/schemas/schema-util'

export const Notifications = new Mongo.Collection('notifications_2')
if (Meteor.isServer) {
  Notifications._ensureIndex(
    {
      userId: 1,
    },
    { name: 'publish_notifications_mine' }
  )
}

export const NotificationSchema = new SimpleSchema({
  _id: OptionalRegExId,

  userId: OptionalString,
  createdAt,
  updatedAt: {
    type: Date,
    optional: true,
  },
  checkedAt: {
    type: Date,
    optional: true,
  },
})

Notifications.attachSchema(NotificationSchema)

export const NotificationItems = new Mongo.Collection('notifications_items')
if (Meteor.isServer) {
  // find recently active items by notification id
  NotificationItems._ensureIndex(
    {
      notificationId: 1,
      status: 1,
      createdAt: -1,
    },
    { name: 'find_active_items_by_notificationId' }
  )

  // update notifications to prevent too many chat items.
  // maybe we should move this to the chat schema
  NotificationItems._ensureIndex(
    {
      notificationId: 1,
      type: 1,
      'data.conversationId': 1,
      status: 1,
      createdAt: 1,
    },
    { name: 'find_active_items_by_notificationId_and_chat_conversationId' }
  )
}

export const NotificationItemSchema = new SimpleSchema({
  _id: OptionalRegExId,

  notificationId: RegExId,
  type: String,
  message: String,
  url: OptionalString,
  data: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  status: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  read: {
    type: Boolean,
    defaultValue: false,
  },
  readAt: {
    type: Date,
    optional: true,
  },
  createdAt,
  updatedAt,
})

NotificationItems.attachSchema(NotificationItemSchema)

export const LocalNotificationItems = new Mongo.Collection('local_notifications_items', {
  connection: null,
})
