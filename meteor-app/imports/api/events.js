import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'

import { createdAt, updatedAt } from '/imports/api/schema'

const Events = new Mongo.Collection('events')

Events.attachSchema(new SimpleSchema({
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
  data: {
    type: SimpleSchema.oneOf(String, Object),
    label: 'Associated data (if any)',
    optional: true,
    blackbox: true,
    custom: () => true,
  },
  createdAt,
  updatedAt,
}));

export default Events

export const eventLog = (params) => {
  Events.insert(params)
}
