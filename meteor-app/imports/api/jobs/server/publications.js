import { Meteor } from 'meteor/meteor'
import Jobs from '../schema'
import { JOB_STATUS_ALL, JOB_STATUS_COMPLETE } from '/imports/api/constants'

// Mainly to get updated changes reflected in job cart
Meteor.publish('jobs.all', () => {
  return Jobs.find({})
})

Meteor.publish('jobs.current', () => {
  return Jobs.find({ status: { $in: JOB_STATUS_ALL } })
})

Meteor.publish('jobs.jobNo', (jobNo) => {
  return Jobs.find({ jobNo })
})

Meteor.publish('jobs.archive', () => {
  return Jobs.find({ status: { $in: JOB_STATUS_COMPLETE } })
})
