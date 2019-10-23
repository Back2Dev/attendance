import { Meteor } from 'meteor/meteor'
import OrderEmails from '../../orderemails/schema'

Meteor.publish('all.orderemails', () => {
  return OrderEmails.find({})
})
