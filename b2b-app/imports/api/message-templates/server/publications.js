import { Meteor } from 'meteor/meteor'
import MessageTemplates from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.messageTemplates', () => {
  return MessageTemplates.find({})
})

Meteor.publish('all.messageTemplates.uses', () => {
  return [MessageTemplates.find({})]
})

Meteor.publish('id.messageTemplates', (id) => {
  return [
    MessageTemplates.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})

Meteor.publish('idslug.messageTemplates', (id) => {
  let query = id
  if (!MessageTemplates.findOne(id)) query = { slug: id }
  return [
    MessageTemplates.find(query),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})

Meteor.publish('slug.messageTemplates', (slug) => {
  return [
    MessageTemplates.find({ slug }),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
