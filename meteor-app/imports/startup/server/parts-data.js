import { Meteor } from 'meteor/meteor' // base
import Orders from '/imports/api/orders/schema'
import CONSTANTS from '/imports/api/constants'

Meteor.methods({
  'archive.order': async function (id) {
    try {
      // Update the status of the existing order to sent
      await Orders.updateAsync(id, { $set: { status: CONSTANTS.ORDER_STATUS_SENT } })
      // const archive = Orders.findOne({_id: order._id})

      // Create a new order
      await Orders.insertAsync({
        status: 1,
        additionalNotes: null,
        orderedParts: [],
        totalPrice: 0
      })
    } catch (e) {
      console.log(e)
    }
  },
  'seed.order': async function (id) {
    try {
      // Create a new order
      await Orders.insertAsync({
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

Meteor.startup(async () => {
  const invalid = await Orders.removeAsync({ totalPrice: { $lt: 0 } })
  if ((await Orders.find().countAsync()) === 0) {
    await Meteor.callAsync('seed.order')
  }
})
