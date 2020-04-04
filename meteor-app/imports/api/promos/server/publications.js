import { Meteor } from 'meteor/meteor'
import Promos from '../schema'
import '../methods'

Meteor.publish('all.promos', () => {
  return Promos.find({})
})

Meteor.publish('promo', id => {
  return Promos.findOne(id)
})
