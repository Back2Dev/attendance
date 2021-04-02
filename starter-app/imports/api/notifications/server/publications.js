import { Meteor } from 'meteor/meteor'
import { Notifications } from '../schema'
import '../methods'

Meteor.publish('notifications.mine', function () {
  if (!this.userId) {
    return this.ready()
  }

  return Notifications.find(
    { userId: this.userId },
    { fields: { userId: 1, updatedAt: 1, checkedAt: 1 } }
  )
})
