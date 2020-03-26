import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schemas/schema-util'

const Charges = new Mongo.Collection('charges')

export const ChargesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...
  
  "token": {
    "type": String,
    "optional": true
  },
  "success": {
    "type": String,
    "optional": true
  },
  "amount": {
    "type": String,
    "optional": true
  },
  "currency": {
    "type": String,
    "optional": true
  },
  "description": {
    "type": String,
    "optional": true
  },
  "email": {
    "type": String,
    "optional": true
  },
  "ip_address": {
    "type": String,
    "optional": true
  },
  "created_at": {
    "type": String,
    "optional": true
  },
  "status_message": {
    "type": String,
    "optional": true
  },
  "error_message": {
    "type": String,
    "optional": true
  },
  "card": {
    "type": String,
    "optional": true
  },
  "transfer": {
    "type": String,
    "optional": true
  },
  "amount_refunded": {
    "type": String,
    "optional": true
  },
  "total_fees": {
    "type": String,
    "optional": true
  },
  "merchant_entitlement": {
    "type": String,
    "optional": true
  },
  "refund_pending": {
    "type": String,
    "optional": true
  },
  "authorisation_expired": {
    "type": String,
    "optional": true
  },
  "captured": {
    "type": String,
    "optional": true
  },
  "captured_at": {
    "type": String,
    "optional": true
  },
  "settlement_currency": {
    "type": String,
    "optional": true
  },
  "active_chargebacks": {
    "type": String,
    "optional": true
  },
  "metadata": {
    "type": String,
    "optional": true
  }
,
  createdAt,
  updatedAt
})

Charges.attachSchema(ChargesSchema)

export default Charges
