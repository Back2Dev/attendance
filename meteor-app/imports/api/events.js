import { Mongo } from 'meteor/mongo'
import { createdAt, updatedAt } from '/imports/api/schema'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const Events = new Mongo.Collection('events')

Events.attachSchema(new SimpleSchema({
  who: {
    type: String,
    label: 'Who',
  },
  what: {
    type: String,
    label: 'Who',
  },
  where: {
    type: String,
    label: 'Who',
    optional: true,
  },
  data: {
    type: Object | String,
    label: 'Associated data (if any)',
    optional: true,
    blackbox: true,
  },
  createdAt,
  updatedAt,
}));

export default Events
