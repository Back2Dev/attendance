import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import { JOB_STATUS_READABLE } from '/imports/api/constants'
import { ServiceItemsSchema } from '../service-items/schema'

const Jobs = new Mongo.Collection('jobs')

// Note: By default, all keys are required
export const JobsSchema = new SimpleSchema({
  _id: RegExId,
  jobNo: String,
  name: { type: String, optional: true, label: 'Customer name' },
  phone: {
    type: String,
    optional: true,
    label: 'Customer phone number',
  },
  email: { type: String, optional: true, label: 'Customer email' },
  isRefurbish: { type: Boolean, label: 'Is a refurbishment' },
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
  serviceItems: {
    type: Array,
    label: 'Details of services/parts required',
  },
  'serviceItems.$': { type: ServiceItemsSchema },
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

Jobs.attachSchema(JobsSchema)

export default Jobs
