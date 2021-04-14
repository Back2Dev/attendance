import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Courses = new Mongo.Collection('courses')

const MapSchema = new SimpleSchema({
  title: String,
  imageUrl: String,
})

export const CoursesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  title: String,
  map: {
    type: Array,
    optional: true,
  },
  'map.$': MapSchema,
  description: OptionalString,
  difficulty: {
    type: String,
    allowedValues: ['beginner', 'intermediate', 'advanced'],
    defaultValue: 'beginner',
  },
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

Courses.attachSchema(CoursesSchema)

export default Courses
