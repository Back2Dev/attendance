import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '/imports/api/constants.js'


const Parts = new Mongo.Collection('parts')

export const PartsSchema = new SimpleSchema({
  // upsert will fail if _id is not optional
  // https://github.com/aldeed/meteor-collection2/issues/124
  _id: OptionalRegExId,
  imageUrl: {
    type: String,
    defaultValue: '/public/images/logo-large.jpg',
  },
  retailPrice: {
    type: SimpleSchema.Integer,
    label: 'Retail Price in cents',
  },
  wholesalePrice: {
    type: SimpleSchema.Integer,
    label: 'Wholesale price in cents',
  },
  partNo: {
    type: String,
    label: 'Part Number',
  },
  name: {
    type: String,
    label: 'Part Name',
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
    allowedValues: Object.keys(CONSTANTS.ORDER_STATUS_READABLE).map(key => parseInt(key, 10)),
    optional: true,
  },
  createdAt,
  updatedAt,
})

Parts.attachSchema(PartsSchema)

export default Parts
