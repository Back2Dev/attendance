import { Meteor } from 'meteor/meteor'
import Promos from '../schema'

Meteor.publish('all.promos', () => {
  return Promos.find({})
})

Meteor.publish('promo', id => {
  return Promos.findOne(id)
})
