import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  RegExId,
  Blackbox,
  createdAt,
  updatedAt,
} from '/imports/api/schemas/schema-util'

const Surveys = new Mongo.Collection('surveys')

export const SurveyStepsSchema = new SimpleSchema({
  name: String,
  id: String,
  questions: Array,
  'questions.$': Blackbox,
})

export const SurveyCoordsSchema = new SimpleSchema({
  id: String, // The id of the variable
  page: { type: SimpleSchema.Integer, defaultValue: 1, optional: true }, // PDF File page no
  y: { type: SimpleSchema.Integer, defaultValue: 0, optional: true }, // X-coordinate on page
  x: { type: SimpleSchema.Integer, defaultValue: 0, optional: true }, // Y-coordinate on page
  width: { type: SimpleSchema.Integer, defaultValue: 10, optional: true }, // size of image
  height: { type: SimpleSchema.Integer, defaultValue: 10, optional: true }, // size of image
  // The 'value' has different meanings:
  // type === 'string' - render the data value itself
  // type === 'checkbox' - if the data value matches this value, render a checkbox
  // type === 'image' - if present, render the image
  value: OptionalString, // The value
  type: {
    type: String,
    allowedValues: ['string', 'checkbox', 'image'],
  },
})

export const SurveysSchema = new SimpleSchema({
  _id: OptionalRegExId,
  slug: String,
  name: {
    type: String,
    optional: true,
  },
  prologue: OptionalString,
  epilogue: OptionalString,
  active: { type: Boolean, defaultValue: true },
  steps: Array,
  'steps.$': SurveyStepsSchema,
  // Filling instructions for the primary person
  primary: Array,
  'primary.$': SurveyCoordsSchema,
  // Filling instructions for the other persons (secondary, tertiary)
  secondary: { type: Array, optional: true },
  'secondary.$': SurveyCoordsSchema,
  version: {
    type: String,
  },
  active: {
    type: 'Boolean',
    optional: true,
  },
  createdAt,
  updatedAt,
})

Surveys.attachSchema(SurveysSchema)

export default Surveys
