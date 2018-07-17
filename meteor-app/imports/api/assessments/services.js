import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Services = new Mongo.Collection('services')

export const ServicesSchema = new SimpleSchema({
  _id: RegExId,
  name: String,
  price: SimpleSchema.Integer,
  createdAt,
  updatedAt,
})

Services.attachSchema('ServicesSchema')

export default Services
