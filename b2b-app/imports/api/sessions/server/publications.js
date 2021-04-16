import { Meteor } from 'meteor/meteor'

import Members from '/imports/api/members/schema'
import Sessions from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Events from '/imports/api/events/schema'
import Tools from '/imports/api/tools/schema' 
*/

Meteor.publish('sessions.mineByEventIds', function (eventIds) {
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
