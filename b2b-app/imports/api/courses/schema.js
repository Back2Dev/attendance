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
if (Meteor.isServer) {
  Courses._ensureIndex(
    {
      status: 1,
    },
    { name: 'status' }
  )
}

export const CoursesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  title: String,
  map: OptionalString,
  description: OptionalString,
  difficulty: OptionalString,
  status: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  createdAt,
  updatedAt,
})

Courses.attachSchema(CoursesSchema)

export default Courses
