import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/schemas/schema-util'

const schema = new SimpleSchema({
  EDITABLE_COLUMNS,
})

export const schemaBridge = new SimpleSchema2Bridge(schema)
