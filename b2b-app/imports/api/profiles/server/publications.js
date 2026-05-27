import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Profiles from '../schema'
import '../methods'
import '../methods.custom'
import { hasRole } from '/imports/api/users/utils.js'

const debug = require('debug')('app:profiles:publications')

const publicFields = {
  name: 1,
  nickname: 1,
  userId: 1,
  mobile: 1,
  avatar: 1,
  badges: { $elemMatch: { private: { $ne: true } } },
  bio: 1,
  favorites: 1,
}

Meteor.publish('profiles.publicProfile', function (profileId) {
  debug({ profileId })
  if (!Match.test(profileId, String)) {
    return this.ready()
  }
  const member = Profiles.find(
    {
      _id: profileId,
    },
    {
      fields: {
        ...publicFields,
      },
    }
  )

  // TODO: get the sessions here

  return [member]
})

Meteor.publish('profiles.byIds', function (memberIds) {
  debug({ memberIds })
  if (!Match.test(memberIds, [String])) {
    return this.ready()
  }
  return Profiles.find(
    {
      _id: { $in: memberIds },
    },
    {
      fields: {
        ...publicFields,
      },
    }
  )
})

Meteor.publish('currentMember', async function () {
  if (!this.userId) {
    return this.ready()
  }
  //This also contains logic to set member to online which we may or may not need for something like chat
  // const ONLINE_STATUS_DELAY_IN_SECONDS = 1
  const UsersHelper = {
    async updateOnlineStatus({ userId, online = true }) {
      const now = new Date()
      if (online === false) {
        // set user offline
        // first, update the offlineTimeoutAt value
        await Profiles.updateAsync(
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
        await Profiles.updateAsync(
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
Meteor.publish('profiles.limit.role', async function (role) {
  const user = await Meteor.users.findOneAsync({ _id: this.userId })
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
