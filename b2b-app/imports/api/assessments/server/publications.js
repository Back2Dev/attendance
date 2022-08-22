import { Meteor } from 'meteor/meteor'
import Assessments from '../schema'
import '../methods-migrate'

Meteor.publish('assessments.all', () => {
  return Assessments.find({})
})
