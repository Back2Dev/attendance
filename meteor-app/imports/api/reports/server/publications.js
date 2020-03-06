import { Meteor } from 'meteor/meteor'
import Reports from '../schema'

Meteor.publish('all.reports', () => {
  return Reports.find({})
})

Meteor.publish('report', id => {
  return Reports.findOne(id)
})

Meteor.methods({
  'rm.reports': id => {
    Reports.remove(id)
  },
  'update.reports': form => {
    const id = form._id
    delete form._id
    Reports.update(id, { $set: form })
  },
  'add.reports': form => {
    Reports.insert(form)
  }
})
