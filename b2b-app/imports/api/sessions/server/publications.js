import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Members from '/imports/api/members/schema'
import Events from '/imports/api/events/schema'
import Tools from '/imports/api/tools/schema' 
*/

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
