import { Meteor } from 'meteor/meteor'
import Jobs from '../schema'
import '../methods'

Meteor.publish('all.jobs', () => {
  return Jobs.find({})
})

Meteor.publish('id.jobs', (id) => {
  console.log({ id })
  return [Jobs.find(id)]
})
