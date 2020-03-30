import { Meteor } from 'meteor/meteor'
import Settings from '../schema'
import '../methods'


Meteor.publish('all.settings', () => {
  return Settings.find({})
})

Meteor.publish('id.settings', id => {
  return [Settings.find(id), ]
})
