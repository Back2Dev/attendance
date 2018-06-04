import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
const debug = require('debug')('att:admin')

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Archives = new Mongo.Collection('archives')

export const ArchiveSchema = new SimpleSchema({
  // _id: {
  //   type: String,
  //   regEx: REGEX_ID,
  //   label: "Unique _id",
  //   optional: false
  // },
  data: {
    type: Object,
    label: 'data',
  },
  createdAt,
  updatedAt,
})

Archives.attachSchema(ArchiveSchema);

export default Archives

export const saveToArchive = (data) => {
  debug('saving to archive')
  debug(data)
  Archives.insert({data: {'key':'value'}})
}
