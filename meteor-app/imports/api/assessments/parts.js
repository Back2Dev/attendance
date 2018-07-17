import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Parts = new Mongo.Collection('parts')

export const PartsSchema = new SimpleSchema({
  _id: RegExId,
  name: String,
  price: SimpleSchema.Integer,
  createdAt,
  updatedAt,
})

Parts.attachSchema('PartsSchema')

export default Parts
