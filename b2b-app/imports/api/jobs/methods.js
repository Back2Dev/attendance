import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import ServiceItems from '/imports/api/service-items/schema.js'
import Jobs, { JobCreateParamsSchema } from './schema'

const debug = require('debug')('b2b:jobs')

Meteor.methods({
  'jobs.create'(data) {
    const cleanData = JobCreateParamsSchema.clean(data)
    debug('clean data', cleanData.serviceItems, cleanData)
    try {
      JobCreateParamsSchema.validate(cleanData)
    } catch (e) {
      debug(e.message)
      return { status: 'failed', message: e.message }
    }

    const jobData = {
      // jobNo will be updated later
      name: cleanData.memberData.name,
      phone: cleanData.memberData.mobile,
      email: cleanData.memberData.email,
      make: cleanData.bikeDetails.make,
      model: cleanData.bikeDetails.model,
      color: cleanData.bikeDetails.color,
      bikeValue: cleanData.bikeDetails.approxValue,
      serviceItems: cleanData.serviceItems,
      totalCost: cleanData.serviceItems.reduce((a, b) => a + b.price, 0),
      dropoffDate: moment(cleanData.pickup.dropOffDate).toDate(),
      pickupDate: moment(cleanData.pickup.pickupDate).toDate(),
      urgent: cleanData.pickup.urgent,
      replacementBike: cleanData.pickup.replacementBike,
    }

    // insert
    let inserted
    try {
      inserted = Jobs.insert(jobData)
    } catch (e) {
      return { status: 'failed', message: e.message }
    }

    // update the service-items, increase the numbersOfUsed value
    try {
      ServiceItems.update(
        { _id: { $in: data.serviceItems.map((item) => item._id) } },
        { $inc: { numbersOfUsed: 1 } },
        { multi: true }
      )
    } catch (e) {
      console.warn('Failed updating ServiceItems', e.message)
    }

    return { status: 'success', id: inserted }
  },
  'rm.jobs': (id) => {
    try {
      const n = Jobs.remove(id)
      return { status: 'success', message: `Removed job` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing job: ${e.message}`,
      }
    }
  },
  'update.jobs': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Jobs.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} job(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating job: ${e.message}`,
      }
    }
  },
  'insert.jobs': (form) => {
    try {
      const id = Jobs.insert(form)
      return { status: 'success', message: `Added job` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding job: ${e.message}`,
      }
    }
  },
})
