import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'

import Members from '/imports/api/members/schema'
import Sessions from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Events from '/imports/api/events/schema'
import Tools from '/imports/api/tools/schema' 
*/
const debug = require('debug')('b2b:sessions:publications')

Meteor.publish('sessions.byEventId', function (eventId) {
  if (!Match.test(eventId, String)) {
    return this.ready()
  }

  return Sessions.find({
    eventId,
    status: { $ne: 'cancelled' },
  })
})

Meteor.publish('sessions.myById', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = Members.findOne({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Sessions.find({
    _id: id,
    memberId: currentMember._id,
  })
})

Meteor.publish('sessions.myAll', function ({ limit = 20 }) {
  if (!Match.test(limit, Match.Integer)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = Members.findOne({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Sessions.find(
    {
      memberId: currentMember._id,
    },
    {
      sort: {
        bookedDate: -1,
      },
      limit,
    }
  )
})

Meteor.publish('sessions.myUpcoming', function () {
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = Members.findOne({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Sessions.find(
    {
      memberId: currentMember._id,
      bookedDate: { $gt: new Date() },
    },
    {
      sort: {
        bookedDate: 1,
      },
    }
  )
})

Meteor.publish('sessions.myRecent', function ({ limit = 20 }) {
  if (!Match.test(limit, Match.Integer)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = Members.findOne({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Sessions.find(
    {
      memberId: currentMember._id,
      bookedDate: { $lt: new Date() },
    },
    {
      sort: {
        bookedDate: -1,
      },
      limit,
    }
  )
})

Meteor.publish('sessions.mineByEventIds', function (eventIds) {
  debug({ eventIds })
  if (!Match.test(eventIds, [String])) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = Members.findOne({ userId: this.userId })

  return Sessions.find({
    memberId: currentMember._id,
    eventId: { $in: eventIds },
  })
})

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
})

Meteor.publish('id.sessions', (id) => {
  return [
    Sessions.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    Members.find({}),
Events.find({}),
Tools.find({}) 
    */
  ]
})
