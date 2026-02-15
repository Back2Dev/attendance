import { Meteor } from 'meteor/meteor'
import PdfTemplates from '../schema'
import { getUserRoles } from '../../users/utils'
import { canDo } from '../../utils/access-control'
import '../methods'

Meteor.publish('all.pdfTemplates', () => {
  return PdfTemplates.find({})
})

Meteor.publish('id.pdfTemplates', (id) => {
  return [PdfTemplates.find(id)]
})

Meteor.publish('idslug.pdfTemplates', async function (id) {
  // check for permission,
  const myRoles = await getUserRoles(this.userId)
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'message-template',
      log: 'idslug.pdfTemplates',
    })
  ) {
    return this.ready()
  }

  let query = id
  if (!(await PdfTemplates.findOneAsync(id))) query = { slug: id }
  return [PdfTemplates.find(query)]
})
