import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/schemas/schema-util'
import { StepsNotificationSchema } from '/imports/api/workflows/schema'

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
