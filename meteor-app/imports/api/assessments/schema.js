import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import { JOB_STATUS_READABLE } from '/imports/api/constants'

const Assessments = new Mongo.Collection('assessments')

export const customerSchema = new SimpleSchema({
  name: { type: String, optional: true, label: 'Customer name' },
  phone: {
    type: String,
    optional: true,
    label: 'Customer phone number',
  },
  email: { type: String, optional: true, label: 'Customer email' },
  isRefurbish: { type: Boolean, label: 'Is a refurbishment' },
})

export const bikeSchema = new SimpleSchema({
  make: { type: String, label: 'Bike make' },
  model: { type: String, optional: true, label: 'Bike model' },
  color: { type: String, label: 'Bike color' },
  bikeValue: {
    type: SimpleSchema.Integer,
    label: 'Estimated bike value in cents',
  },
  sentimentValue: {
    type: Boolean,
    optional: true,
    label: 'Bike holds sentimental value',
  },
})

export const servicesSchema = new SimpleSchema({
  serviceItem: Array,
  'serviceItem.$': Object,
  'serviceItem.$.name': {
    type: String,
    label: 'Service description',
  },
  'serviceItem.$.price': {
    type: SimpleSchema.Integer,
    label: 'Price in cents',
  },
  baseService: { type: String, label: 'Base service selection' },
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
        return new Meteor.Error(
          `Total service cost ${this.value} not equal the sum of its parts ${calcServicesCost}!`
        )
      }
    },
  },
})

export const partsSchema = new SimpleSchema({
  partsItem: Array,
  'partsItem.$': Object,
  'partsItem.$.name': {
    type: String,
    label: 'Parts name/description',
  },
  'partsItem.$.price': {
    type: SimpleSchema.Integer,
    label: 'Price of single parts item in cents',
  },
  'partsItem.$.code': {
    type: String,
    label: '(F)ront or (B)ack of bike, or (O)ther',
  },
  'partsItem.$.category': { type: String, label: 'Parts category' },
  'partsItem.$.used': { type: Boolean, label: 'Is used' },
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
        return new Meteor.Error(
          'Total parts cost not equal the sum of its parts!'
        )
      }
    },
  },
})

// Note: By default, all keys are required
export const AssessmentsSchema = new SimpleSchema({
  _id: RegExId,
  jobNo: String,
  customerDetails: {
    type: customerSchema,
    label: 'Customer details',
  },
  bikeDetails: { type: bikeSchema, label: 'Bike details' },
  services: {
    type: servicesSchema,
    label: 'Details of services required',
  },
  parts: { type: partsSchema, label: 'Details of parts required' },
  additionalFees: {
    type: SimpleSchema.Integer,
    label: 'Additional cost in cents',
  },
  discount: {
    type: SimpleSchema.Integer,
    label: 'Discount in cents',
  },
  totalCost: {
    type: SimpleSchema.Integer,
    label: 'Total cost in cents',
    custom() {
      // console.log('This', this)
      // Validation to ensure that sum of all costs is equal total cost
      const services =
        this.siblingField('services.totalServiceCost').value || 0
      const parts =
        this.siblingField('parts.totalPartsCost').value || 0
      const additional =
        this.siblingField('additionalFees').value || 0
      const discount = this.siblingField('discount').value || 0

      const check =
        services + parts + additional - discount === this.value
      if (!check && this.operator !== '$set') {
        return new Meteor.Error(
          `Total repair cost ${this.value} not equal sum of services ${services}, parts ${parts} and additional fees ${additional}, less discount ${discount}`
        )
      }
    },
  },
  dropoffDate: { type: Date, label: 'Bike drop-off date' },
  pickupDate: { type: Date, label: 'Bike pick-up date' },
  urgent: {
    type: Boolean,
    label: 'Field to indicate if bike repair is urgent',
  },
  assessor: { type: String, label: 'Assessor name' },
  mechanic: { type: String, optional: true, label: 'Mechanic name' },
  comment: {
    type: String,
    optional: true,
    label:
      'Field for putting in notes or additional services required',
  },
  temporaryBike: {
    type: Boolean,
    label: 'Field to indicate if a temporary bike was provided',
  },
  status: {
    type: SimpleSchema.Integer,
    allowedValues: Object.keys(JOB_STATUS_READABLE).map((key) =>
      parseInt(key, 10)
    ),
    label: 'Status of job',
  },
  search: { type: String, label: 'Combination of searchable data' },
  paid: { type: Boolean, defaultValue: false },
  charge_token: { type: String, optional: true },
  card: { type: Object, optional: true, blackbox: true },
  paidAt: { type: Date, optional: true },
  createdAt,
  updatedAt,
})

Assessments.attachSchema(AssessmentsSchema)

export default Assessments
