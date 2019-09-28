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
  wwcc: String,
  surname: String,
  expiry: { type: Date, optional: true },
  responses: {
    type: Array,
    label: 'Array of responses received',
    defaultValue: []
    // blackbox: true
  },
  'responses.$': responseSchema,
  createdAt,
  updatedAt
})

Wwccs.attachSchema(WwccsSchema)

export default Wwccs
