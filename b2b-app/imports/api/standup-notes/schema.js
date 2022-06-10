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

const StandupNotes = new Mongo.Collection('standupNotes')

export const StandupNotesSchema = new SimpleSchema({
  _id: OptionalRegExId,

  
  "yesterday": {
    "type": String,
    "optional": true
  },
  "today": OptionalString,
  "blockers": OptionalString,
  "userId": String,
  "userName": String
,

  createdAt,
  updatedAt,
})

StandupNotes.attachSchema(StandupNotesSchema)

export default StandupNotes
