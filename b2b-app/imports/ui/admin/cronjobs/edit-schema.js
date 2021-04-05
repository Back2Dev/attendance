import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { OptionalRegExId, RegExId } from '/imports/api/schemas/schema-util'

const schema = new SimpleSchema({
  
  "name": {
    "type": String
  },
  "frequency": {
    "type": String,
    "label": "Frequency"
  },
  "type": {
    "type": String
  },
  "lastRun": {
    "type": Date,
    "optional": true
  },
  "nextRun": {
    "type": Date,
    "optional": true
  }
,
})

export const schemaBridge = new SimpleSchema2Bridge(schema)
