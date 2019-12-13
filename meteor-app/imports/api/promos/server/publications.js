import { Meteor } from 'meteor/meteor'
import Promos from '../schema'

Meteor.publish('all.promos', () => {
  return Promos.find({})
})

Meteor.publish('promo', id => {
  return Promos.findOne(id)
})
Meteor.methods({
  'rm.Promos': id => {
    Promos.remove(id)
  },
  'update.Promos': form => {
    const id = form._id
    delete form._id
    Promos.update(id, { $set: form })
  },
  'add.Promos': form => {
    Promos.insert(form)
  }
})
