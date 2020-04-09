import { Meteor } from 'meteor/meteor'
import Charges from '../schema'
import '../methods'

Meteor.publish('all.charges', () => {
  return Charges.find({})
})

Meteor.publish('id.charges', id => {
  return [Charges.find(id)]
})
