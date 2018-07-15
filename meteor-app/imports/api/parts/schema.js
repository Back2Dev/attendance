import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'
import { RegExId } from '../schema';

const Parts = new Mongo.Collection('parts')

export const PartsSchema = new SimpleSchema({
  _id: RegExId,
  imageUrl: {
    type: String,
    defaultValue: '/public/images/logo-large.jpg',
  },
  retailPrice: {
    type: SimpleSchema.Integer,
    label: 'Retail Price in cents',
    optional: false,
  },
  wholesalePrice: {
    type: SimpleSchema.Integer,
    label: 'Wholesale price in cents',
    optional: false,
  },
  partNo: {
    type: String, 
    label: 'Part Number',
    optional: false,
  },
  desc: {
    type: String,
    label: 'Description',
    optional: true,
  },
  barcode: {
    type: String,
    label: 'Barcode',
    optional: true,
  },
  status: {
    type: SimpleSchema.Integer,
    label: 'Part Status',
    optional: true,
    defaultValue: 1,
  },
  createdAt,
  updatedAt,
})

Parts.attachSchema(PartsSchema)

export default Parts
