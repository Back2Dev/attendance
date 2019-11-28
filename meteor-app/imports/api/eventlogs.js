import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Eventlogs = new Mongo.Collection('eventlogs')

export const EventlogsSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: 'Unique _id',
    optional: false
  },
  who: {
    type: String,
    label: 'Who'
  },
  what: {
    type: String,
    label: 'What'
  },
  where: {
    type: String,
    label: 'Where',
    optional: true
  },
  object: {
    type: Object,
    label: 'Associated data (if any)',
    optional: true,
    blackbox: true
  },
  createdAt,
  updatedAt
})

Eventlogs.attachSchema(EventlogsSchema)

export default Eventlogs

export const eventLog = params => {
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
  }
})
