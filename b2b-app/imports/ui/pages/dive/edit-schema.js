import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { OptionalString } from '/imports/api/utils/schema-util'

const schema = new SimpleSchema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  project: OptionalString,
  description: {
    type: String,
  },
})

export const schemaBridge = new SimpleSchema2Bridge({ schema })
