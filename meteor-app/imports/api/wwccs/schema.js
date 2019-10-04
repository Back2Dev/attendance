import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { OptionalRegExId, RegExId, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '/imports/api/constants.js'

const Wwccs = new Mongo.Collection('wwccs')

const responseSchema = new SimpleSchema({
  approval: Boolean, //A boolean representing if the individual is permitted to work with children.
  status: String, //	Possible values for status defined in the "Status Attribute" section of this documentation.
  message: String, //	The message returned from the Department of Justice and Regulation.
  retrieved: {
    type: Object, //	Any extra data that we retrieve from the Department of Justice and Regulation.
    blackbox: true
  },
  createdAt
})

export const WwccsSchema = new SimpleSchema({
  // upsert will fail if _id is not optional
  // https://github.com/aldeed/meteor-collection2/issues/124
  _id: OptionalRegExId,
  memberId: RegExId,
  wwcc: {
    type: String,
    label: 'Working With Children Check (WWCC) number',
    optional: true
  },
  wwccOk: {
    type: Boolean,
    label: '(WWCC) checked ok',
    defaultValue: false,
    optional: true
  },
  wwccExpiry: {
    type: Date,
    label: '(WWCC) expiry date',
    optional: true
  },
  wwccError: {
    type: String,
    label: '(WWCC) error message',
    optional: true
  },
  wwccSurname: {
    type: String,
    label: '(WWCC) surname',
    optional: true
  },
  createdAt,
  updatedAt
})

Wwccs.attachSchema(WwccsSchema)

export default Wwccs
