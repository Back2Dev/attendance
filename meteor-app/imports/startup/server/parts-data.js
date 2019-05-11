import { Meteor } from 'meteor/meteor' // base
import Orders from '/imports/api/orders/schema'
import CONSTANTS from '/imports/api/constants'

Meteor.methods({
  'archive.order'(id) {
    try {
      // Update the status of the existing order to sent
      Orders.update(id, { $set: { status: CONSTANTS.ORDER_STATUS_SENT } })
      // const archive = Orders.findOne({_id: order._id})

      // Create a new order
      Orders.insert({
        status: 1,
        additionalNotes: null,
        orderedParts: [],
        totalPrice: 0
      })
    } catch (e) {
      console.log(e)
    }
  }
})

Meteor.startup(() => {
  const invalid = Orders.remove({ totalPrice: { $lt: 0 } })
  if (Orders.find().count() === 0) {
    Meteor.call('seed.order')
  }
})
