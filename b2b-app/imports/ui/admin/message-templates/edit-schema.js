import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { OptionalRegExId, RegExId } from '/imports/api/utils/schema-util'

const schema = new SimpleSchema({
  name: String,
  slug: String,
  number: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: ['SMS', 'EMAIL', 'APP', 'API'],
  },
  body: String,
})

export const schemaBridge = new SimpleSchema2Bridge(schema)
