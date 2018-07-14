import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'

import { createdAt, updatedAt } from '/imports/api/schema'

const Parts = new Mongo.Collection('parts')

export const PartsSchema = new SimpleSchema({
  imageUrl: {
    type: String,
    defaultValue: '/public/images/logo-large.jpg',
  },
  retailPrice: {
    type: Number,
    label: 'Retail Price',
    optional: false,
  },
  wholesalePrice: {
    type: Number,
    label: 'Wholesale price',
    optional: false,
  },
  number: {
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
  createdAt,
  updatedAt,
})

Parts.attachSchema(PartsSchema)

export default Parts
