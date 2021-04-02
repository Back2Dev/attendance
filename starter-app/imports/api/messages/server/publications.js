import { Meteor } from 'meteor/meteor'
import Messages from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Propertys from '/imports/api/propertys/schema'
import Tos from '/imports/api/tos/schema'
import Froms from '/imports/api/froms/schema' 
*/

Meteor.publish('all.messages', () => {
  return Messages.find({})
})

Meteor.publish('id.messages', (id) => {
  return [
    Messages.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    Listings.find({}),
Propertys.find({}),
Tos.find({}),
Froms.find({}) 
    */
  ]
})
