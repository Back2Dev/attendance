import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  RegExId,
  OptionalRegExId,
  createdAt,
  updatedAt,
  OptionalString,
} from './schema-util'

const Archives = new Mongo.Collection('archives')

export const CreatedBySchema = new SimpleSchema({
  userId: String,
  username: String,
})

export const DataItemSchema = new SimpleSchema({
  dataId: String,
  data: String,
})

export const ArchivesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  type: {
    type: String,
    label: 'Collection name',
  },
  label: OptionalString,
  data: Array,
  'data.$': DataItemSchema,
  createdBy: {
    type: CreatedBySchema,
    label: 'User id and username, who archived this',
  }, //
  createdAt,
  updatedAt,
})

Archives.attachSchema(ArchivesSchema)

export default Archives

export const ArchiveProps = new SimpleSchema({
  collectionName: String,
  label: OptionalString,
  recordIds: Array,
  'recordIds.$': RegExId,
})

export const RestoreProps = new SimpleSchema({
  ids: Array,
  'ids.$': RegExId,
  keepTheCopy: Boolean,
})

export const RemoveProps = new SimpleSchema({
  ids: Array,
  'ids.$': RegExId,
})

export const GetArchivesProps = new SimpleSchema({
  collectionName: OptionalString,
})
