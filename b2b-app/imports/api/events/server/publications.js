import { Meteor } from 'meteor/meteor'

import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema.js'
import Events from '../schema'
import '../methods'

Meteor.publish('all.events', () => {
  return Events.find({})
})

/**
 * Publish future events for booking
 */
Meteor.publish('future.events', function () {
  const currentMember = Members.findOne({ userId: this.userId })

  const events = Events.find({
    active: true,
    when: { $gt: new Date() },
  })

  const arrEventIds = []
  const arrCoachIds = []

  events?.map((event) => {
    arrEventIds.push(event._id)
    arrCoachIds.push(event.coachId)
  })

  const coaches = Members.find(
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

  // select all sessions belong this current user and related to those above events
  const sessions = currentMember
    ? Sessions.find({
        memberId: currentMember._id,
        eventId: { $in: arrEventIds },
      })
    : null

  return [events, coaches, sessions]
})
