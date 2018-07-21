import { Meteor } from 'meteor/meteor'
import Assessment from '../assessment'

// Mainly to get updated changes reflected in job cart
Meteor.publish('assessment', () => {
  return Assessment.find({})
})
