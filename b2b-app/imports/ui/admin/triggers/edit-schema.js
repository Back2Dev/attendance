import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'

const StepsNotificationSchema = new SimpleSchema({
  number: { type: SimpleSchema.Integer, defaultValue: 999 },
  trigger: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.TRIGGERS),
    defaultValue: 'complete',
  },
  text: String, // This is the slug of the MessageTemplate
  // body: OptionalString, // TODO - remove this
  recipients: { type: Array, optional: true },
  'recipients.$': {
    type: String,
    allowedValues: Object.keys(CONSTANTS.NOTIFY_ROLES),
  },
  delay: OptionalString,
  method: { type: String, allowedValues: Object.keys(CONSTANTS.NOTIFICATION_METHODS) },
  userInfo: { type: Boolean, optional: true },
})

const schema = new SimpleSchema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
  },
  notifications: {
    type: Array,
  },
  'notifications.$': {
    type: StepsNotificationSchema,
  },
})

export const schemaBridge = new SimpleSchema2Bridge(schema)
