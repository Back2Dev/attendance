import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Events = new Mongo.Collection('events')

export const EventSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: "Unique _id",
    optional: false
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
  object: {
    type: Object,
    label: 'Associated data (if any)',
    optional: true,
    blackbox: true,
  },
  createdAt,
  updatedAt,
})

Events.attachSchema(EventSchema);

export default Events

export const eventLog = (params) => {
  Events.insert(params)
}
