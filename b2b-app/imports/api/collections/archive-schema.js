import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  RegExId,
  OptionalRegExId,
  Blackbox,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Archives = new Mongo.Collection('archives')

export const ArchivesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  type: {
    type: String,
    label: 'Collection name',
  },
  data: String,
  // data: {
  //   type: Blackbox,
  //   label: 'The record data',
  // },
  createdBy: {
    type: String,
    label: 'User id, who archived this',
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
