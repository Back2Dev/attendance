import { Mongo } from 'meteor/mongo'
import ServerSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalRegExId,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

export const DiagramsSchema = new ServerSchema({
  _id: OptionalRegExId,

  name: String,
  slug: String,
  diagram: Blackbox,
  createdAt,
  updatedAt,
})
