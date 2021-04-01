import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
} from '/imports/api/schema'

const Eventlogs = new Mongo.Collection('eventlogs')

export const EventlogsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  eventType: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
  },
  who: {
    type: String,
    label: 'Who',
  },
  what: {
    type: String,
    label: 'What',
  },
  where: {
    type: String,
    label: 'Where',
    optional: true,
  },
  objectId: {
    type: OptionalRegExId,
  },
  object: {
    type: Object,
    label: 'Associated data (if any)',
    optional: true,
    blackbox: true,
  },
  createdAt,
  updatedAt,
})

Eventlogs.attachSchema(EventlogsSchema)

export default Eventlogs

export const eventLog = (params) => {
  Eventlogs.insert(params)
}

Eventlogs.allow({
  update() {
    return false
  },
  insert() {
    return true
  },
  remove() {
    return false
  },
})
