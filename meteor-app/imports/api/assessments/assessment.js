import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Assessment = new Mongo.Collection('assessment')

export const STATUS = ['New Job', 'Assigned', 'In Progress', 'Job Completed', 'Bike Picked Up']

// Note: By default, all keys are required
export const AssessmentSchema = new SimpleSchema({
  _id: RegExId,
  customerDetails: Object,
  'customerDetails.name': { type: String, optional: true },
  'customerDetails.phone': { type: String, optional: true },
  'customerDetails.email': { type: String, optional: true },
  'customerDetails.refurbishment': Boolean,
  bikeDetails: Object,
  'bikeDetails.make': String,
  'bikeDetails.model': { type: String, optional: true },
  'bikeDetails.color': String,
  'bikeDetails.bikeValue': { type: SimpleSchema.Integer, label: 'Estimated bike value in cents' },
  'bikeDetails.sentimentValue': { type: Boolean, optional: true },
  services: Object,
  'services.serviceItem': Array,
  'services.serviceItem.$': Object,
  'services.serviceItem.$.name': String,
  'services.serviceItem.$.price': { type: SimpleSchema.Integer, label: 'Price of service in cents' },
  'services.totalServiceCost': SimpleSchema.Integer,
  parts: Object,
  'parts.partsItem': Array,
  'parts.partsItem.$': Object,
  'parts.partsItem.$.name': String,
  'parts.partsItem.$.price': { type: SimpleSchema.Integer, label: 'Price of parts in cents' },
  'parts.totalPartsCost': SimpleSchema.Integer,
  additionalFees: { type: SimpleSchema.Integer, label: 'Additional cost in cents' },
  totalCost: { type: SimpleSchema.Integer, label: 'Total cost in cents' },
  dropoffDate: Date,
  pickupDate: Date,
  urgent: Boolean,
  assessor: String,
  mechanic: { type: String, optional: true },
  comment: { type: String, optional: true, label: 'Field for putting in notes or additional services required' },
  temporaryBike: { type: Boolean, label: 'Field to indicate if a temporary bike was provided' },
  status: { type: String, allowedValues: STATUS, label: 'Status of job' },
  search: { type: String, label: 'Concat of customer name, bike make and color for search functionality' },
  createdAt,
  updatedAt,
})

Assessment.attachSchema(AssessmentSchema)

export default Assessment
