import { Meteor } from 'meteor/meteor'
import Triggers from '../schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import '../methods'
import { getUserRoles } from '/imports/api/users/utils'
import { canDo } from '/imports/api/utils/access-control'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.triggers', async function() {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({ op: 'readAny', role: myRoles, resource: 'trigger', log: 'all.triggers' })
  ) {
    return this.ready()
  }

  return [Triggers.find({}), MessageTemplates.find({})]
})
