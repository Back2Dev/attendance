import { Meteor } from 'meteor/meteor'
import Assessments from '/imports/api/assessments/schema'
import Jobs from '/imports/api/jobs/schema'
import ServiceItems from '/imports/api/service-items/schema'

const debug = require('debug')('app:assessments')

const statusMap = {
  1: 'new',
  2: 'in-Progress',
  3: 'quality-check',
  4: 'ready',
  5: 'completed',
  6: 'cancelled',
}

Meteor.methods({
  'migrate.jobs': (clean) => {
    try {
      if (clean) {
        debug('Removing jobs')
        Jobs.remove({})
      }
      let n = 0
      Assessments.find({}).forEach((ass) => {
        const serviceItems = []
          .concat(ass.parts.partsItem)
          .concat(ass.services.serviceItem)
          .map((item) => {
            const s = ServiceItems.findOne({ name: item.name })
            if (s) return s
            else {
              console.log(`Could not find part/service item: ${item.name}, creating`)
              item._id = ServiceItems.insert(item)
              return item
            }
          })
          .filter(Boolean)
        if (ass.additionalFees)
          serviceItems.push({ name: ass.comment || 'extras', price: ass.additionalFees })
        const tot = serviceItems.reduce((acc, item) => {
          return acc + item.price
        }, 0)
        if (tot !== ass.totalCost)
          serviceItems.push({ name: 'Adjustment', price: ass.totalCost - tot })
        const rec = {
          ...ass,
          status: statusMap[ass.status],
          bikeName:
            `${ass.bikeDetails.make} ${ass.bikeDetails.model} ${ass.bikeDetails.color}`.trim() ||
            'Service',
          assessor: ass.assessor,
          dropoffDate: ass.dropoffDate,
          pickupDate: ass.pickupDate,
          note: ass.comment,
          serviceItems,
        }
        debug(`Inserting job`, rec)
        if (Jobs.insert(rec)) {
          n = n + 1
        }
      })
      return { status: 'success', message: `Migrated ${n} assessments => jobs` }
    } catch (e) {
      const message = `Error migrating job: ${e.message}`
      console.error(message)
      return {
        status: 'failed',
        message,
      }
    }
  },
})
