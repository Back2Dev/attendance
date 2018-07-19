import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const ServiceItems = new Mongo.Collection('serviceItems')

export const PartsSchema = new SimpleSchema({
  _id: RegExId,
  name: { type: String, label: 'Parts description' },
  price: { type: SimpleSchema.Integer, label: 'Price in cents' },
  createdAt,
  updatedAt,
})

ServiceItems.attachSchema(PartsSchema)

export default ServiceItems
