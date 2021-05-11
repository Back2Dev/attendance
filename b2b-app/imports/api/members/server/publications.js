import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Members from '../schema'
import '../methods'
import '../methods.custom'
import { hasRole } from '/imports/api/users/utils.js'

const debug = require('debug')('b2b:members:publications')

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

Meteor.publish('members.publicProfile', function (memberId) {
  debug({ memberId })
  if (!Match.test(memberId, String)) {
    return this.ready()
  }
  const member = Members.find(
    {
      _id: memberId,
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

Meteor.publish('members.byIds', function (memberIds) {
  debug({ memberIds })
  if (!Match.test(memberIds, [String])) {
    return this.ready()
  }
  return Members.find(
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

Meteor.publish('currentMember', function () {
  if (!this.userId) {
    return this.ready()
  }
  //This also contains logic to set member to online which we may or may not need for something like chat
  // const ONLINE_STATUS_DELAY_IN_SECONDS = 1
  const UsersHelper = {
    updateOnlineStatus({ userId, online = true }) {
      const now = new Date()
      if (online === false) {
        // set user offline
        // first, update the offlineTimeoutAt value
        Members.update(
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
        //   const me = Members.findOne(
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
        //       Members.update(
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
        Members.update(
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
  return Members.find({ userId: this.userId, status: 'active' })
})

Meteor.publish('all.members', () => {
  return Members.find({})
})
Meteor.publish('members.limit.role', (role) => {
  const user = Meteor.users.findOne({ _id: Meteor.userId() })
  if (hasRole(user, role)) {
    return Members.find({})
  } else {
    return []
  }
})
Meteor.publish('id.members', (id) => {
  return [
    Members.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
