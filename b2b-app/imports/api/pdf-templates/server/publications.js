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

Meteor.publish('all.names.pdfTemplates', () => {
  return PdfTemplates.find(
    {},
    { fields: { name: 1 }, limit: 50, sort: { createdAt: -1 } }
  )
})
