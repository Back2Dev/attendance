import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
  Blackbox,
} from '/imports/api/utils/schema-util'

const Audits = new Mongo.Collection('audits')

export const AuditsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...

  event: {
    type: String,
    label: 'Audit trail event type',
  },
  user: {
    type: String,
    label: 'User id, username or name',
    optional: true,
  },
  data: {
    type: SimpleSchema.oneOf(String, Blackbox, Array, Number, Boolean),
    optional: true,
  },
  'data.$': Blackbox,
  createdAt,
  updatedAt,
})

Audits.attachSchema(AuditsSchema)

export default Audits
