import { Mongo } from 'meteor/mongo'
import ServerSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalString,
  OptionalRegExId,
  createdAt,
  updatedAt,
  updatedBy,
} from '/imports/api/utils/schema-util'

const SamplesSchema = new ServerSchema({
  _id: OptionalRegExId,
  name: String,
  jsCode: { type: Object, blackbox: true, optional: true },
})

export const PdfTemplatesSchema = new ServerSchema({
  _id: OptionalRegExId,

  jsCode: {
    type: String,
    label: 'Javascript PDF Make template',
  },
  slug: String,
  project: OptionalString,
  name: String,
  docType: String,
  samples: { type: Array, optional: true, defaultValue: [] },
  'samples.$': SamplesSchema,
  createdAt,
  updatedAt,
  updatedBy,
})
