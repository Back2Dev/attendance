import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'

import Profiles from '/imports/api/profiles/schema'
import Bookings from '/imports/api/bookings/schema.js'
import Events from '../schema'
import '../methods'
import '../methods-workshop'

const debug = require('debug')('app:events:publications')

Meteor.publish('events.byDateRange', function ({ start, end }) {
  if (!Match.test(start, Date)) {
    return this.ready()
  }
  if (!Match.test(end, Date)) {
    return this.ready()
  }

  return Events.find({
    status: { $in: ['active', 'cancelled'] },
    $and: [{ when: { $gte: start } }, { when: { $lte: end } }],
  })
})

Meteor.publish('all.events', () => {
  return Events.find({})
})

Meteor.publish('events.byIds', function (eventIds) {
  if (!Match.test(eventIds, [String])) {
    return this.ready()
  }
  return Events.find({
    _id: { $in: eventIds },
    status: { $in: ['active', 'cancelled'] },
  })
})

Meteor.publish('events.byId', function (eventId) {
  if (!Match.test(eventId, String)) {
    return this.ready()
  }
  return Events.find({
    _id: eventId,
    status: { $in: ['active', 'cancelled'] },
  })
})

Meteor.publish('id.events', function (eventId) {
  if (!Match.test(eventId, String)) {
    return this.ready()
  }
  return Events.find({
    _id: eventId,
    status: { $in: ['active', 'cancelled'] },
  })
})

/**
 * Public events page — no login required.
 * Returns active events where public: true.
 * showPast: true returns past events instead of future.
 */
Meteor.publish('events.public', function ({ showPast = false } = {}) {
  const now = new Date()
  const dateFilter = showPast ? { $lt: now } : { $gte: now }
  return Events.find({
    status: { $in: ['active', 'cancelled'] },
    public: true,
    when: dateFilter,
  })
})

/**
 * Member events page — requires login.
 * Returns all active events + current user's bookings.
 * showPast: true returns past events instead of future.
 */
Meteor.publish('events.member', async function ({ showPast = false } = {}) {
  if (!this.userId) return this.ready()

  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  const now = new Date()
  const dateFilter = showPast ? { $lt: now } : { $gte: now }

  const events = Events.find({
    status: { $in: ['active', 'cancelled'] },
    when: dateFilter,
  })

  const arrEventIds = []
  events?.forEach((event) => arrEventIds.push(event._id))

  const bookings = Bookings.find({
    profileId: currentMember?._id,
    eventId: { $in: arrEventIds },
  })

  return [events, bookings]
})

/**
 * Publish future events for booking
 */
Meteor.publish('future.events', async function () {
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })

  const events = Events.find({
    // status: { $in: ['active', 'cancelled'] },
    when: { $gt: new Date() },
  })

  const arrEventIds = []
  const arrCoachIds = []

  events?.map((event) => {
    arrEventIds.push(event._id)
    arrCoachIds.push(event.coachId)
  })

  const coaches = Profiles.find(
    {
      _id: { $in: arrCoachIds },
    },
    {
      fields: {
        name: 1,
        userId: 1,
        mobile: 1,
        avatar: 1,
      },
    }
  )

  // select all bookings belong this current user and related to those above events
  const bookings = Bookings.find({
    profileId: currentMember?._id,
    eventId: { $in: arrEventIds },
  })
  // : null

  return [events, coaches, bookings]
})
