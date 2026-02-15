import { Meteor } from 'meteor/meteor'
import Workflows, { Jobs, Stages, Tasks } from '../schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import ReminderPlans from '/imports/api/reminder-plans/schema'
import { hasRole } from '/imports/api/users/utils'
import '../methods-basic' // Basic CRUD methods

const debug = require('debug')('app:workflows-pubs')

Meteor.publish('all.workflows', async function() {
  if (!(await hasRole(this.userId, 'ADM'))) {
    return this.ready()
  }
  // console.log(Workflows.find({}))
  return Workflows.find({})
})

Meteor.publish('list.workflows', async function() {
  if (!(await hasRole(this.userId, 'ADM'))) {
    return this.ready()
  }
  return Workflows.find({}, { fields: { _id: 1, slug: 1, name: 1 } })
})

Meteor.publish('id.workflows', async function (id) {
  if (!(await hasRole(this.userId, 'ADM'))) {
    return this.ready()
  }
  const workflow = await Workflows.findOneAsync(id)
  return [Workflows.find(id), MessageTemplates.find({}), ReminderPlans.find({})]
})
