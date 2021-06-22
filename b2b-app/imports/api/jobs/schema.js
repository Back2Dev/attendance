import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import {
  RegExId,
  OptionalRegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util.js'
import CONSTANTS from '/imports/api/constants'
import { ServiceItemsSchema } from '../service-items/schema'

const Jobs = new Mongo.Collection('jobs')

export const JobUpdateStatusParamsSchema = new SimpleSchema({
  id: String,
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.JOB_STATUS_READABLE),
  },
})

export const JobCreateParamsSchema = new SimpleSchema({
  serviceItems: Array,
  'serviceItems.$': ServiceItemsSchema.pick(
    '_id',
    'name',
    'price',
    'code',
    'category',
    'used'
  ),
  bikeDetails: new SimpleSchema({
    make: String,
    model: String,
    color: String,
    type: String,
    approxValue: Number,
  }),
  selectedMember: {
    type: new SimpleSchema({
      _id: RegExId,
      userId: OptionalRegExId,
    }),
    optional: true,
  },
  memberData: {
    type: new SimpleSchema({
      name: String,
      mobile: String,
      email: String,
      addressPostcode: String,
    }),
    optional: true,
  },
  pickup: new SimpleSchema({
    urgent: Boolean,
    dropOffDate: String,
    pickupDate: String,
    replacementBike: { type: String, optional: true },
  }),
})

// Note: By default, all keys are required
export const JobsSchema = new SimpleSchema({
  _id: RegExId,
  memberId: OptionalRegExId,
  jobNo: { type: String, optional: true },
  name: { type: String, optional: true, label: 'Customer name' },
  phone: {
    type: String,
    optional: true,
    label: 'Customer phone number',
  },
  email: { type: String, optional: true, label: 'Customer email' },
  postcode: { type: String, optional: true, label: 'Customer postcode' },
  isRefurbish: { type: Boolean, label: 'Is a refurbishment', defaultValue: false },
  make: { type: String, label: 'Bike make' },
  model: { type: String, optional: true, label: 'Bike model' },
  color: { type: String, label: 'Bike color' },
  bikeType: { type: String, optional: true, label: 'Bike Type' },
  bikeValue: {
    type: SimpleSchema.Integer,
    label: 'Estimated bike value in cents',
  },
  sentimentValue: {
    type: Boolean,
    optional: true,
    label: 'Bike holds sentimental value',
  },
  serviceItems: {
    type: Array,
    label: 'Details of services/parts required',
  },
  'serviceItems.$': ServiceItemsSchema.pick(
    '_id',
    'name',
    'price',
    'code',
    'category',
    'used'
  ),
  totalCost: {
    type: SimpleSchema.Integer,
    label: 'Total cost in cents',
    custom() {
      // Validation to ensure that sum of all service item costs is equal total service item cost
      const serviceItems = this.siblingField('serviceItems').value
      const calcServicesCost = serviceItems.reduce((a, b) => {
        return a + b.price
      }, 0)
      const check = calcServicesCost === this.value
      if (!check) {
        return new Meteor.Error(
          'Total services/parts cost not equal the sum of its parts!'
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
  assessor: { type: String, optional: true, label: 'Assessor name' },
  mechanic: { type: String, optional: true, label: 'Mechanic name' },
  comment: {
    type: String,
    optional: true,
    label: 'Field for putting in notes or additional services required',
  },
  replacementBike: {
    type: String,
    optional: true,
    label: 'Field to indicate if a temporary bike was provided',
  },
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.JOB_STATUS_READABLE),
    defaultValue: 'new',
    label: 'Status of job',
  },
  paid: { type: Boolean, defaultValue: false },
  charge_token: { type: String, optional: true },
  card: { type: Object, optional: true, blackbox: true },
  paidAt: { type: Date, optional: true },
  createdAt,
  updatedAt,
})

Jobs.attachSchema(JobsSchema)

export default Jobs
