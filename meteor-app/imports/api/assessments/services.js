import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Services = new Mongo.Collection('services')

export const ServicesSchema = new SimpleSchema({
  _id: RegExId,
  name: { type: String, label: 'Service description' },
  price: { type: SimpleSchema.Integer, label: 'Price in cents' },
  createdAt,
  updatedAt,
})

Services.attachSchema(ServicesSchema)

export default Services
