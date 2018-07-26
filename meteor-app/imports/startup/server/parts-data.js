import { Meteor } from 'meteor/meteor' // base
import Orders from '/imports/api/orders/schema'

Meteor.methods({
 
  async 'seed.order'() {
    try {
      await Orders.insert ({
        status: 1,
        additionalNotes: null,
        orderedParts: [],
        totalPrice: 0,
      })
    } catch(e) {
      console.log(e)
    }
    

  },
})

Meteor.startup(() => {
  const invalid = (Orders.remove( { totalPrice : { $lt: 0 }  } ))
  if (Orders.find().count() === 0) {
    Meteor.call('seed.order')
  }
})
