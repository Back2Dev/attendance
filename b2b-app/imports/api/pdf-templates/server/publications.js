import { Meteor } from 'meteor/meteor'
import PdfTemplates from '../schema'
import '../methods'

Meteor.publish('all.pdfTemplates', () => {
  // Note: We limit to 50 records, because this could be a memory expensive publication
  return PdfTemplates.find({}, { limit: 50, sort: { createdAt: -1 } })
})

Meteor.publish('id.pdfTemplates', (id) => {
  return [PdfTemplates.find(id)]
})

Meteor.publish('list.pdfTemplates', () => {
  return PdfTemplates.find(
    {},
    { fields: { _id: 1, name: 1, revision: 1, description: 1, source: 1, active: 1 } }
  )
})
