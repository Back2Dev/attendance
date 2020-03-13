import { Meteor } from 'meteor/meteor'
import Parts from '../schema'
import Orders from '/imports/api/orders/schema'

Meteor.publish('all.parts', () => {
  return Parts.find({}, { limit: 50 })
})

Meteor.publish('find.parts', searchFor => {
  const reg = new RegExp(searchFor, 'i')
  return [
    Parts.find(
      {
        $or: [{ partNo: reg }, { name: reg }]
      },
      { limit: 50 }
    ),
    Orders.find({})
  ]
})


Meteor.publish('id.parts', id => {
  return [Parts.find(id), ]
})

Meteor.publish('add.parts', () => {
  return []
})

Meteor.methods({
  'rm.Parts': id => {
    Parts.remove(id)
  },
  'update.Parts': form => {
    const id = form._id
    delete form._id
    Parts.update(id, { $set: form })
  },
  'add.Parts': form => {
    Parts.insert(form)
  }
})
