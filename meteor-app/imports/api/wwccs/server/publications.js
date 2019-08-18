import { Meteor } from 'meteor/meteor'
import Wwccs from '../schema'

Meteor.publish('all.wwccs', () => {
  return Wwccs.find({}, { limit: 50 })
})
