import { Meteor } from 'meteor/meteor'
import Forms from './schema'
const aws = require('aws-sdk')

const debug = require('debug')('target:forms')

const s3config = new aws.Config({
  accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  region: Meteor.settings.private.S3_REGION,
})

const s3 = new aws.S3(s3config)

Meteor.methods({
  'rm.forms': (id) => {
    try {
      const n = Forms.remove(id)
      return { status: 'success', message: `Removed form` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing form: ${e.message}`,
      }
    }
  },
  'update.forms': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Forms.update(id, { $set: form })
      return { status: 'success', message: 'Form Saved' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating form: ${e.message}`,
      }
    }
  },
  'insert.forms': (form) => {
    try {
      const id = Forms.insert(form)
      return { status: 'success', message: `Added form` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding form: ${e.message}`,
      }
    }
  },
  's3.deleteObject': ({fileName}) => {
    s3.deleteObject({Bucket:Meteor.settings.private.UPLOAD_BUCKET, Key:fileName}, function (err, data) {
        if (err) return console.error(`Error: Could not delete file from s3 ${err}`)
        return console.info('file deleted from s3', fileName)
      })
    },
})
