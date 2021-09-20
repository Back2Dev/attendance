import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  RegExId,
  OptionalRegExId,
  createdAt,
  updatedAt,
  OptionalString,
} from '/imports/api/utils/schema-util'

const Archives = new Mongo.Collection('archives')

export const CreatedBySchema = new SimpleSchema({
  userId: String,
  username: String,
})

export const ArchivesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  type: {
    type: String,
    label: 'Collection name',
  },
  dataId: String,
  data: String,
  // data: {
  //   type: Blackbox,
  //   label: 'The record data',
  // },
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
