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
