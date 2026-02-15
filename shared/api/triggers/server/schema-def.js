import ServerSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
  updatedBy,
} from '/imports/api/utils/schema-util'

export const NotificationSchema = new ServerSchema({
  number: { type: ServerSchema.Integer, defaultValue: 999 },
  text: String,
  delay: OptionalString,
  method: OptionalString,
  from: OptionalString,
  fromName: OptionalString,
})

export const TriggersSchema = new ServerSchema({
  _id: OptionalRegExId,
  revision: ServerSchema.Integer,
  revisedAt: Date,
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  project: OptionalString,
  description: {
    type: String,
    optional: true,
  },
  notifications: {
    type: Array,
  },
  // we probably need a subject and a url link (for app)
  'notifications.$': {
    type: NotificationSchema,
  },
  createdAt,
  updatedAt,
  updatedBy,
})
