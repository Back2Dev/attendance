import { Meteor } from 'meteor/meteor'
import MessageTemplates from '/imports/api/message-templates/schema'
import Triggers from '/imports/api/triggers/schema'
import Workflows from '/imports/api/workflows/schema'
import '/imports/api/message-templates/methods'
import { getUserRoles } from '../../users/utils'
import { canDo } from '../../utils/access-control'
import '/imports/api/assets/server/asset-hooks'

Meteor.publish('all.messageTemplates', function () {
  // check for permission
  // const myRoles = getUserRoles(this.userId)
  // if (
  //   !canDo({
  //     op: 'readAny',
  //     role: myRoles,
  //     resource: 'message-template',
  //     log: 'all.messageTemplates',
  //   })
  // ) {
  //   return this.ready()
  // }
  return MessageTemplates.find({})
})

Meteor.publish('all.messageTemplates.uses', async function() {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'message-template',
      log: 'all.messageTemplates.uses',
    })
  ) {
    return this.ready()
  }
  return [MessageTemplates.find({}), Workflows.find({})]
})

Meteor.publish('id.messageTemplates', async function(id) {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'message-template',
      log: 'id.messageTemplates',
    })
  ) {
    return this.ready()
  }
  return [
    MessageTemplates.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})

Meteor.publish('idslug.messageTemplates', async function (id) {
  // check for permission,
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'message-template',
      log: 'idslug.messageTemplates',
    })
  ) {
    return this.ready()
  }

  let query = id
  if (!(await MessageTemplates.findOneAsync(id))) query = { slug: id }
  return [
    MessageTemplates.find(query),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})

Meteor.publish('slug.messageTemplates', async function(slug) {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'message-template',
      log: 'slug.messageTemplates',
    })
  ) {
    return this.ready()
  }

  return [
    MessageTemplates.find({ slug }),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})

// This is a hack for exporting from UAT eKitelopment

Meteor.publish('all.messageTemplates.export', () => {
  return [MessageTemplates.find({}), Workflows.find({}), Triggers.find({})]
})
