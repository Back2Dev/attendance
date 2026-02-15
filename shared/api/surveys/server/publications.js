import { Meteor } from 'meteor/meteor'
import Surveys from '../schema'
import '../methods'
import { getUserRoles } from '../../users/utils'
import { canDo } from '../../utils/access-control'

Meteor.publish('all.surveys', async function() {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (!canDo({ op: 'readAny', role: myRoles, resource: 'survey', log: 'all.surveys' })) {
    return this.ready()
  }

  return [
    Surveys.find(
      {},
      {
        fields: {
          name: 1,
          slug: 1,
          variant: 1,
          version: 1,
          versionLabel: 1,
          updatedAt: 1,
          doctype: 1,
          active: 1,
          project: 1,
        },
      }
    ),
  ]
})

Meteor.publish('id.surveys', async function(id) {
  // check for permission
  const myRoles = await getUserRoles(this.userId)
  if (!canDo({ op: 'readAny', role: myRoles, resource: 'survey', log: 'id.surveys' })) {
    return this.ready()
  }

  return [Surveys.find(id)]
})
