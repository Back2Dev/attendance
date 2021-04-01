import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
} from '/imports/api/schemas/schema-util'

const Cronjobs = new Mongo.Collection('cronjobs')

export const CronjobsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...

  name: {
    type: String,
  },
  frequency: {
    type: String,
    label: 'Frequency',
  },
  type: {
    type: String,
  },
  lastRun: {
    type: Date,
    optional: true,
  },
  nextRun: {
    type: Date,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['ready', 'running', 'failed'],
    defaultValue: 'ready',
  },
  active: { type: Boolean, defaultValue: true },
  createdAt,
  updatedAt,
})

Cronjobs.attachSchema(CronjobsSchema)

export default Cronjobs
