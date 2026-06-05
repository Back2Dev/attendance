import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'

import Profiles from '/imports/api/profiles/schema'
import Events from '/imports/api/events/schema.js'
import Locations from '/imports/api/locations/schema.js'
import Bookings from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Events from '/imports/api/events/schema'
import Rentals from '/imports/api/rentals/schema'
*/
const debug = require('debug')('app:bookings:publications')

Meteor.publish('sessions.byEventId', function (eventId) {
  if (!Match.test(eventId, String)) {
    return this.ready()
  }

  return Bookings.find({
    eventId,
    status: { $ne: 'cancelled' },
  })
})

Meteor.publish('sessions.myByIdComposite', async function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }

  const publication = this

  debug('test multiple cursors', { id })
  const bookings = Bookings.find({
    _id: id,
    profileId: currentMember._id,
  })

  const findEvents = (eventId) => {
    const events = Events.find({ _id: eventId }).observeChanges({
      added(_id, fields) {
        debug('event added', _id, fields)
        publication.added('events', _id, fields)
      },
      changed(_id, fields) {
        debug('event changed', _id, fields)
        publication.changed('events', _id, fields)
      },
      removed(_id) {
        debug('events removed', _id)
        publication.removed('events', _id)
      },
    })
    publication.onStop(() => {
      events.stop()
    })
  }

  const bookingsHandle = bookings.observeChanges({
    added(_id, fields) {
      debug('added', _id, fields)
      findEvents(fields.eventId)
    },
    changed(_id, fields) {
      debug('changed', _id, fields)
      if (fields.eventId) {
        findEvents(fields.eventId)
      }
    },
  })
  publication.onStop(() => {
    if (bookingsHandle && bookingsHandle.stop) {
      bookingsHandle.stop()
    }
  })

  // debug(this)
  const courses = Locations.find({})
  return [bookings, courses]
})

Meteor.publish('sessions.myById', async function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Bookings.find({
    _id: id,
    profileId: currentMember._id,
  })
})

Meteor.publish('sessions.myAll', async function ({ limit = 20 }) {
  if (!Match.test(limit, Match.Integer)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Bookings.find(
    {
      profileId: currentMember._id,
    },
    {
      sort: {
        bookedDate: -1,
      },
      limit,
    }
  )
})

Meteor.publish('sessions.myUpcoming', async function () {
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Bookings.find(
    {
      profileId: currentMember._id,
      bookedDate: { $gt: new Date() },
    },
    {
      sort: {
        bookedDate: 1,
      },
    }
  )
})

Meteor.publish('sessions.myRecent', async function ({ limit = 20 }) {
  if (!Match.test(limit, Match.Integer)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })
  if (!currentMember) {
    return this.ready()
  }
  return Bookings.find(
    {
      profileId: currentMember._id,
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

Meteor.publish('sessions.mineByEventIds', async function (eventIds) {
  debug({ eventIds })
  if (!Match.test(eventIds, [String])) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }
  const currentMember = await Profiles.findOneAsync({ userId: this.userId })

  return Bookings.find({
    profileId: currentMember._id,
    eventId: { $in: eventIds },
  })
})

Meteor.publish('all.sessions', () => {
  return Bookings.find({})
})

Meteor.publish('id.sessions', (id) => {
  return [
    Bookings.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    Profiles.find({}),
Events.find({}),
Rentals.find({})
    */
  ]
})
