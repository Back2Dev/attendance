import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schemas/schema-util'

const Charges = new Mongo.Collection('charges')

export const ChargesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...

  token: {
    type: String,
    optional: true
  },
  success: {
    type: String,
    optional: true
  },
  amount: {
    type: SimpleSchema.Integer,
    optional: true
  },
  currency: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  ip_address: {
    type: String,
    optional: true
  },
  created_at: {
    type: Date
  },
  status_message: {
    type: String,
    optional: true
  },
  error_message: {
    type: String,
    optional: true
  },
  card: {
    type: Object,
    blackbox: true,
    optional: true
  },
  transfer: {
    type: Object,
    blackbox: true,
    optional: true
  },
  amount_refunded: {
    type: SimpleSchema.Integer,
    optional: true
  },
  total_fees: {
    type: SimpleSchema.Integer,
    optional: true
  },
  merchant_entitlement: {
    type: String,
    optional: true
  },
  refund_pending: {
    type: Boolean,
    optional: true
  },
  authorisation_expired: {
    type: Boolean,
    optional: true
  },
  captured: {
    type: Boolean,
    optional: true
  },
  captured_at: {
    type: String,
    optional: true
  },
  settlement_currency: {
    type: String,
    optional: true
  },
  active_chargebacks: {
    type: Boolean,
    optional: true
  },
  metadata: {
    type: Object,
    blackbox: true,
    optional: true
  },
  reconciled: Boolean,
  matched: Boolean,
  createdAt,
  updatedAt
})

Charges.attachSchema(ChargesSchema)

export default Charges
