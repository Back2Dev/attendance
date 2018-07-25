import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import { JOB_STATUS_READABLE } from '/imports/api/constants'

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
  baseService: { type: String, label: 'Base service selection'},
  totalServiceCost: {
    type: SimpleSchema.Integer,
    label: 'Price of service in cents',
    custom() {
      // Validation to ensure that sum of all services costs is equal total service cost
      const services = this.siblingField('serviceItem').value
      const calcServicesCost = services.reduce((a, b) => {
        return a + b.price
      }, 0)
      const check = calcServicesCost === this.value
      if (!check) {
        return new Meteor.Error('Total service cost not equal the sum of its parts!')
      }
    }
  }
})

export const partsSchema = new SimpleSchema({
  partsItem: Array,
  'partsItem.$': Object,
  'partsItem.$.name': { type: String, label: 'Parts name/description' },
  'partsItem.$.price': { type: SimpleSchema.Integer, label: 'Price of single parts item in cents' },
  totalPartsCost: { 
    type: SimpleSchema.Integer, 
    label: 'Price of parts in cents',
    custom() {
      // Validation to ensure that sum of all parts costs is equal total parts cost
      const parts = this.siblingField('partsItem').value
      const calcPartsCost = parts.reduce((a, b) => {
        return a + b.price
      }, 0)
      const check = calcPartsCost === this.value
      if (!check) {
        return new Meteor.Error('Total parts cost not equal the sum of its parts!')
      }
    } 
  }
})

// Note: By default, all keys are required
export const AssessmentSchema = new SimpleSchema({
  _id: RegExId,
  customerDetails: { type: customerSchema, label: 'Customer details' },
  bikeDetails: { type: bikeSchema, label: 'Bike details' },
  services: { type: servicesSchema, label: 'Details of services required' },
  parts: { type: partsSchema, label: 'Details of parts required' },
  additionalFees: { type: SimpleSchema.Integer, label: 'Additional cost in cents' },
  totalCost: { 
    type: SimpleSchema.Integer, 
    label: 'Total cost in cents',
    custom() {
      // Validation to ensure that sum of all costs is equal total cost
      const services = this.siblingField('services.totalServiceCost').value
      const parts = this.siblingField('parts.totalPartsCost').value
      const additional = this.siblingField('additionalFees').value

      const check = services + parts + additional === this.value
      if (!check) {
        return new Meteor.Error('Total repair cost not equal sum of services, parts and additional fees')
      }
    } 
  },
  dropoffDate: { type: Date, label: 'Bike drop-off date' },
  pickupDate: { type: Date, label: 'Bike pick-up date' },
  urgent: { type: Boolean, label: 'Field to indicate if bike repair is urgent' },
  assessor: { type: String, label: 'Assessor name' },
  mechanic: { type: String, optional: true, label: 'Mechanic name' },
  comment: { type: String, optional: true, label: 'Field for putting in notes or additional services required' },
  temporaryBike: { type: Boolean, label: 'Field to indicate if a temporary bike was provided' },
  status: { type: SimpleSchema.Integer, allowedValues: Object.keys(JOB_STATUS_READABLE).map(key => parseInt(key, 10)), label: 'Status of job in status id or key' },
  search: { type: String, label: 'Concat of customer name, bike make and color for search functionality' },
  createdAt,
  updatedAt,
})

Assessment.attachSchema(AssessmentSchema)

export default Assessment
