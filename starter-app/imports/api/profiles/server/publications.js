import { Meteor } from 'meteor/meteor'
import Profiles from '../schema'
import '../methods'
import '../methods.custom'
import { hasRole } from '/imports/api/users/utils.js'

/* Commented out related publications (if any) - best to add these in manually as required
 
*/

const publicFields = { username: 1, emails: 1, roles: 1 }

Meteor.publish('currentProfile', function () {
  if (!this.userId) {
    return this.ready()
  }
  //This also contains logic to set profile to online which we may or may not need for something like chat
  // const ONLINE_STATUS_DELAY_IN_SECONDS = 1
  const UsersHelper = {
    updateOnlineStatus({ userId, online = true }) {
      const now = new Date()
      if (online === false) {
        // set user offline
        // first, update the offlineTimeoutAt value
        Profiles.update(
          {
            userId,
          },
          {
            $set: {
              'onlineStatus.offlineTimeoutAt': now,
            },
          }
        )
        // then delay update the online status
        // Meteor.setTimeout(() => {
        //   const me = Profiles.findOne(
        //     { userId },
        //     {
        //       fields: { onlineStatus: 1 },
        //     }
        //   )
        //   if (me && me.onlineStatus && me.onlineStatus.offlineTimeoutAt) {
        //     if (
        //       moment(me.onlineStatus.offlineTimeoutAt).isBefore(
        //         moment().subtract(ONLINE_STATUS_DELAY_IN_SECONDS - 1, 'seconds')
        //       )
        //     ) {
        //       // mark user is offline
        //       Profiles.update(
        //         {
        //           userId,
        //         },
        //         {
        //           $set: {
        //             onlineStatus: {
        //               online: false,
        //               offlineTimeoutAt: null,
        //               updatedAt: new Date(),
        //             },
        //           },
        //         }
        //       )
        //     }
        //   }
        // }, ONLINE_STATUS_DELAY_IN_SECONDS)
      } else {
        // set user online
        Profiles.update(
          {
            userId,
          },
          {
            $set: {
              onlineStatus: {
                online: true,
                offlineTimeoutAt: null,
                updatedAt: now,
              },
            },
          }
        )
      }
    },
  }
  this.onStop(() => {
    // update the user online status
    UsersHelper.updateOnlineStatus({ userId: this.userId, online: false })
  })
  return Profiles.find({ userId: this.userId, status: 'active' })
})

Meteor.publish('all.profiles', () => {
  return Profiles.find({})
})
Meteor.publish('profiles.limit.role', (role) => {
  const user = Meteor.users.findOne({ _id: Meteor.userId() })
  if (hasRole(user, role)) {
    return Profiles.find({})
  } else {
    return []
  }
})
Meteor.publish('id.profiles', (id) => {
  return [
    Profiles.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
