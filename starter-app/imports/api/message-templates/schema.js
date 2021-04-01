import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
  OptionalString,
} from '/imports/api/schemas/schema-util'

const MessageTemplates = new Mongo.Collection('messageTemplates')

export const MessageTemplatesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: String,
  slug: String,
  subject: OptionalString,
  revision: { type: SimpleSchema.Integer, defaultValue: 1 },
  type: { type: String, allowedValues: ['SMS', 'EMAIL', 'APP', 'API'] },
  recipients: { type: Array, optional: true },
  'recipients.$': String,
  number: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  body: String,
  url: OptionalString, // For in-app notifications
  createdAt,
  updatedAt,
})

MessageTemplates.attachSchema(MessageTemplatesSchema)

export default MessageTemplates
