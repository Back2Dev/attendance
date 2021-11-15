import { Meteor } from 'meteor/meteor'
import { Promise } from 'meteor/promise'
// import { DDP } from 'meteor/ddp-client'
import simpleDDP from 'simpleddp'
import ws from 'isomorphic-ws'
import Members from '../members/schema'
import Assessments, { Logger } from '/imports/api/assessments/schema'
import Jobs from '/imports/api/jobs/schema'
import ServiceItems from '/imports/api/service-items/schema'

const debug = require('debug')('app:assessments')

const statusMap = {
  1: 'new',
  2: 'in-progress',
  3: 'quality-check',
  4: 'ready',
  5: 'completed',
  6: 'cancelled',
}

const LOG_EVENT_READABLE = {
  20: 'Update status',
  21: 'Mechanic',
  22: 'Assessed by',
  23: 'Phone call',
  24: 'SMS sent',
  26: 'Paid',
  27: 'Unpaid',
}

const JOB_STATUS_BUTTON = {
  1: 'new',
  2: 'in-progress',
  3: 'quality-check',
  4: 'ready',
  5: 'completed',
  6: 'new',
}

const getDesc = (log, ass) => {
  switch (log.eventType) {
    case 20:
      return `status => ${JOB_STATUS_BUTTON[log.status]}`
    case 22:
      return `${LOG_EVENT_READABLE[log.eventType]} ${ass.assessor}`
    default:
      return `${LOG_EVENT_READABLE[log.eventType]} ${log.data || ''}`
  }
}

let n = { jobs: 0, members: 0, users: 0 }

const doMigration = (connection, id) => {
  debug('Connected, subscribing to assessments')
  const assSub = connection.subscribe('assessments.all')
  Promise.await(assSub.ready())
  let assessments = connection.collection('assessments').fetch()

  assessments
    .filter((ass) => (id ? ass.id === id : true))
    .forEach((ass) => {
      const { customerDetails: cust } = ass
      ass.name = cust.name
      ass.phone = cust.phone
      cust.mobile = cust.phone
      if (!cust.isRefurbish && cust.name) {
        if (cust.email) {
          cust.roles = ['CUS']
          const res = Meteor.call('addNewUser', cust)
          if (res.status === 'success') {
            const m = Members.findOne({ userId: res.userId })
            ass.memberId = m?._id
            n.members = n.members + 1
            n.users = n.users + 1
          }
        } else {
          const m = Members.findOne({ mobile: cust.mobile })
          if (m) ass.memberId = m._id
          else {
            cust.nickname = cust.name.split(' ')[0] || cust.name
            cust.notifyBy = ['EMAIL', 'SMS']
            ass.memberId = Members.insert(cust)
            n.members = n.members + 1
          }
        }
      }

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

      debug(`Subscribing to logger ${ass.id}`)
      const logSub = connection.subscribe('logger.assessment', ass.id)
      Promise.await(logSub.ready())
      let loggers = connection
        .collection('logger')
        .fetch()
        .filter((log) => log.aId === ass.id)
      // const loggers = Logger.find({ aId: ass._id })

      debug('go')
      ass._id = ass.id
      const rec = {
        ...ass,
        status: statusMap[ass.status],
        bikeName:
          'make model color'
            .split(/[\s,]+/)
            .map((key) => ass.bikeDetails[key] || '')
            .filter(Boolean)
            .join(' ') || 'Service',
        // `${ass.bikeDetails.make} ${ass.bikeDetails.model} ${ass.bikeDetails.color}`.trim() ||
        // 'Service',
        assessor: ass.assessor,
        dropoffDate: ass.dropoffDate,
        pickupDate: ass.pickupDate,
        note: ass.comment,
        serviceItems,
        history: loggers.map((log) => {
          log.statusBefore = 'new'
          log.statusAfter = JOB_STATUS_BUTTON[log.status]
          log.description = getDesc(log, ass)
          return log
        }),
      }
      debug(`Inserting job`, rec)
      if (Jobs.insert(rec)) {
        Jobs.update(
          ass._id,
          { $set: { createdAt: ass.createdAt } },
          { getAutoValues: false }
        )
        n.jobs = n.jobs + 1
      }
    })
  // connection.close()
  Promise.await(connection.stopChangeListeners())
  Promise.await(connection.disconnect())
}

Meteor.methods({
  'migrate.jobs': (clean, id) => {
    try {
      if (clean) {
        debug('Removing jobs, users and members')
        const jobQuery = id ? { _id: id } : {}
        Jobs.remove(jobQuery)
        if (id) {
          const job = Jobs.findOne(jobQuery)
          if (job) {
            Meteor.users.remove({ core: { $exists: false }, _id: job.userId })
            Members.remove({ core: { $exists: false }, _id: job.memberId })
          }
        } else {
          Meteor.users.remove({ core: { $exists: false } })
          Members.remove({ core: { $exists: false } })
        }
      }
      let options = {
        endpoint: `wss://app.back2bikes.com.au:443/websocket`,
        SocketConstructor: ws,
        reconnectInterval: 5000,
      }
      console.log(`Connecting to Meteor server on ${options.endpoint}`)
      const remote = new simpleDDP(options)
      Promise.await(remote.connect())
      doMigration(remote, id)
      return {
        status: 'success',
        message: `Migrated ${n.jobs} assessments => jobs, users: ${n.users}, members: ${n.members}`,
      }
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
