import { Meteor } from 'meteor/meteor'
import PdfTemplates from './schema'
const debug = require('debug')('app:pdfTemplates')

Meteor.methods({
  'rm.pdfTemplates': (id) => {
    try {
      const n = PdfTemplates.remove(id)
      return { status: 'success', message: `Removed pdftemplate` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing pdftemplate: ${e.message}`,
      }
    }
  },
  'update.pdfTemplates': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = PdfTemplates.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} pdftemplate(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating pdftemplate: ${e.message}`,
      }
    }
  },
  'insert.pdfTemplates': (form) => {
    try {
      const id = PdfTemplates.insert(form)
      return { status: 'success', message: `Added ${id} pdftemplate`, id }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding pdftemplate: ${e.message}`,
      }
    }
  },
  'find.pdfTemplates': (id) => {
    try {
      const item = PdfTemplates.findOne({ _id: id })
      return { status: 'success', message: `Found pdftemplate`, item }
    } catch (e) {
      return {
        status: 'failed',
        message: e.message,
      }
    }
  },
})
