import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, createdAt, updatedAt, OptionalRegExId } from '/imports/api/schema'

const Reports = new Mongo.Collection('reports')

export const ReportEventsSchema = new SimpleSchema({
  timestamp: Date,
  type: {
    type: String,
    allowedValues: ['normal', 'section']
  },
  description: String,
  object: {
    type: Object,
    optional: true,
    blackbox: true
  }
})

export const ReportsSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: 'Unique id',
    optional: false
  },
  userId: OptionalRegExId,
  name: String,
  details: String,
  events: { type: Array, optional: true },
  'events.$': { type: ReportEventsSchema },
  createdAt,
  updatedAt
})

Reports.attachSchema(ReportsSchema)

export default Reports
