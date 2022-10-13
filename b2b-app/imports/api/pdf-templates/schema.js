import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const PdfTemplates = new Mongo.Collection('pdfTemplates')

export const PdfTemplatesSchema = new SimpleSchema({
  _id: OptionalRegExId,

  
  "name": String,
  "revision": {
    "type": SimpleSchema.Integer,
    "defaultValue": "1"
  },
  "description": OptionalString,
  "active": {
    "type": Boolean,
    "defaultValue": true
  },
  "source": OptionalString
,

  createdAt,
  updatedAt,
})

PdfTemplates.attachSchema(PdfTemplatesSchema)

export default PdfTemplates
