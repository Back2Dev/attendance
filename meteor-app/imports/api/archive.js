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
  type: {
    type: String,
    optional: false,
  },
  data: {
    type: Object,
    label: 'data',
    blackbox: true,
  },
  createdAt,
  updatedAt,
})

Archives.attachSchema(ArchiveSchema);

export default Archives

export const saveToArchive = (type, data) => {
  debug(`Archiving ${type}:`, data)
  Archives.insert({
    type,
    data
  })
}
