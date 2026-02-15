import ServerSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
  updatedBy,
  OptionalString,
} from '/imports/api/utils/schema-util'

export const MessageTemplatesSchema = new ServerSchema({
  _id: OptionalRegExId,
  name: String,
  slug: String,
  project: OptionalString,
  subject: OptionalString,
  revision: { type: ServerSchema.Integer, defaultValue: 1 },
  type: { type: String, allowedValues: ['SMS', 'EMAIL', 'APP', 'API'] },
  to: {
    type: String,
    optional: true,
  },

  recipients: { type: Array, optional: true },
  'recipients.$': String,
  number: {
    type: ServerSchema.Integer,
    optional: true,
  },
  // From email and name
  from_name: OptionalString,
  from_email: OptionalString,
  // email attachments, name of the method to call to get the attachments
  attachmentMethod: OptionalString,
  // body is plain text (SMS/APP/EMAIL)
  body: String,
  // Rich text version for EMAIL
  HTMLbody: { type: String, optional: true },
  mjml: OptionalString,
  url: OptionalString, // For in-app notifications - clickable link
  createdAt,
  updatedAt,
  updatedBy,
})
