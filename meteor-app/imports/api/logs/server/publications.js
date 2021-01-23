import { Meteor } from 'meteor/meteor'
import Logs from '../schema'
import '../methods'
import Members from '/imports/api/members/schema'

Meteor.publish('all.logs', () => {
  return Logs.find({})
})

Meteor.publish('id.logs', (id) => {
  return [Logs.find(id), Members.find({})]
})
