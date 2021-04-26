import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { OptionalRegExId } from '/imports/api/utils/schema-util'

const schema = new SimpleSchema({
  slug: {
    type: String,
  },
  name: {
    type: String,
  },
  steps: {
    type: SimpleSchema.oneOf(Object, Array),
    blackbox: true,
  },
  'steps.$': {
    type: Object,
    blackbox: true,
  },
  version: {
    type: String,
  },
  active: {
    type: Boolean,
    optional: true,
  },
})

export const schemaBridge = new SimpleSchema2Bridge(schema)
