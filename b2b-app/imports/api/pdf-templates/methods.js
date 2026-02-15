import { Meteor } from 'meteor/meteor'
import PdfTemplates from './schema'
import { downloadFile, uploadFile } from '/imports/api/s3-utils'
var fs = require('fs')
const debug = require('debug')('app:pdfTemplates')
const Bucket = Meteor.settings.private.DOCUMENTS_BUCKET

Meteor.methods({
  'rm.pdfTemplates': async (id) => {
    try {
      const n = await PdfTemplates.removeAsync(id)
      return { status: 'success', message: `Removed pdftemplate` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing pdftemplate: ${e.message}`,
      }
    }
  },
  'update.pdfTemplates': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await PdfTemplates.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} pdftemplate(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating pdftemplate: ${e.message}`,
      }
    }
  },
  'insert.pdfTemplates': async (form) => {
    try {
      const id = await PdfTemplates.insertAsync(form)
      return { status: 'success', message: `Added pdftemplate` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding pdftemplate: ${e.message}`,
      }
    }
  },
  'upsert.slug.pdf-templates': async (form) => {
    try {
      const rec = await PdfTemplates.findOneAsync({ slug: form.slug })
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        Object.keys(rec)
          .filter((key) => !key.match(/_id|At|By$/))
          .forEach((key) => {
            if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
          })
        await PdfTemplates.updateAsync({ _id }, { $set: form, $unset: unset })
        return { status: 'success', message: `Updated pdf-template ${form.slug}` }
      } else {
        const id = await PdfTemplates.insertAsync(form)
        return { status: 'success', message: `Added pdf-template ${form.slug}` }
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding pdftemplate: ${e.message}`,
      }
    }
  },
  'download.pdfTemplates': async (slug) => {
    try {
      const file = await downloadFile({
        Bucket,
        Key: `document-templates/pdfmake-${slug}.js`,
      })
      if (file.statusCode === 404)
        return {
          status: 'success',
          message: `404 - new pdftemplate`,
          result: file.body,
        }
      return {
        status: 'success',
        message: `downloaded pdftemplate`,
        result: file.Body.toString(),
      }
    } catch (e) {
      console.error(e)
      return {
        status: 'failed',
        message: `downloaded pdftemplate`,
        result: `dd = {content: ["Error retrieving template: ${e.statusCode}"]}`,
      }
    }
  },
  'upload.pdfTemplates': async ({ slug, content }) => {
    try {
      return {
        status: 'success',
        message: `uploaded pdftemplate`,
        result: await uploadFile({
          Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
          Key: `document-templates/pdfmake-${slug}.js`,
          Body: Buffer.from(content),
          ContentType: 'text/javascript',
          CacheControl: 'max-age=0',
        }),
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error uploading pdftemplate: ${e.message}`,
      }
    }
  },
})
