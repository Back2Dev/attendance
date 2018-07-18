import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import { JOB_STATUS } from '/imports/api/constants'

const Assessment = new Mongo.Collection('assessment')

export const customerSchema = new SimpleSchema({
  name: { type: String, optional: true, label: 'Customer name' },
  phone: { type: String, optional: true, label: 'Customer phone number' },
  email: { type: String, optional: true, label: 'Customer email' },
  refurbishment: { type: Boolean, label: 'Stating whether this job is a refurbishment' },
})

export const bikeSchema = new SimpleSchema({
  make: { type: String, label: 'Bike make' },
  model: { type: String, optional: true, label: 'Bike model' },
  color: { type: String, label: 'Bike color' },
  bikeValue: { type: SimpleSchema.Integer, label: 'Estimated bike value in cents' },
  sentimentValue: { type: Boolean, optional: true, label: 'Field to indicate if bike holds sentimental value' }
})

export const servicesSchema = new SimpleSchema({
  serviceItem: Array,
  'serviceItem.$': Object,
  'serviceItem.$.name': { type: String, label: 'Service description' },
  'serviceItem.$.price': { type: SimpleSchema.Integer, label: 'Price of single service item in cents' },
  totalServiceCost: { type: SimpleSchema.Integer, label: 'Price of service in cents' }
})

export const partsSchema = new SimpleSchema({
  partsItem: Array,
  'partsItem.$': Object,
  'partsItem.$.name': { type: String, label: 'Parts name/description' },
  'partsItem.$.price': { type: SimpleSchema.Integer, label: 'Price of single parts item in cents' },
  totalPartsCost: { type: SimpleSchema.Integer, label: 'Price of parts in cents' }
})

// Note: By default, all keys are required
export const AssessmentSchema = new SimpleSchema({
  _id: RegExId,
  customerDetails: { type: customerSchema, label: 'Customer details' },
  bikeDetails: { type: bikeSchema, label: 'Bike details' },
  services: { type: servicesSchema, label: 'Details of services required' },
  parts: { type: partsSchema, label: 'Details of parts required' },
  additionalFees: { type: SimpleSchema.Integer, label: 'Additional cost in cents' },
  totalCost: { type: SimpleSchema.Integer, label: 'Total cost in cents' },
  dropoffDate: { type: Date, label: 'Bike drop-off date' },
  pickupDate: { type: Date, label: 'Bike pick-up date' },
  urgent: { type: Boolean, label: 'Field to indicate if bike repair is urgent' },
  assessor: { type: String, label: 'Assessor name' },
  mechanic: { type: String, optional: true, label: 'Mechanic name' },
  comment: { type: String, optional: true, label: 'Field for putting in notes or additional services required' },
  temporaryBike: { type: Boolean, label: 'Field to indicate if a temporary bike was provided' },
  status: { type: SimpleSchema.Integer, allowedValues: Object.keys(JOB_STATUS).map(key => parseInt(key, 10)), label: 'Status of job in status id or key' },
  search: { type: String, label: 'Concat of customer name, bike make and color for search functionality' },
  createdAt,
  updatedAt,
})

Assessment.attachSchema(AssessmentSchema)

export default Assessment
