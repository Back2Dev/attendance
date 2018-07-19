import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Services = new Mongo.Collection('services')

export const ServicesSchema = new SimpleSchema({
  _id: RegExId,
  name: { type: String, label: 'Service description' },
  price: { type: SimpleSchema.Integer, label: 'Price in cents' },
  package: { type: String, label: 'Minor or major service package' },
  createdAt,
  updatedAt,
})

Services.attachSchema(ServicesSchema)

export default Services
