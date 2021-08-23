// AWS
import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import { generatePDF } from '/imports/api/utils/pdf-generate'

const aws = require('aws-sdk')
const s3config = new aws.Config({
  accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  region: Meteor.settings.private.S3_REGION,
})

const debug = require('debug')('app:workflow-utils')

const s3 = new aws.S3(s3config)

export const uploadFile = (params) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, res) {
      if (err) {
        debug(err, err.stack) // an error occurred
        reject('Unable to upload file to S3')
      } else {
        debug(`Successfully saved file ${params.Key} ${params.ContentType}`) // success
        resolve(res)
      }
    })
  })
}

export const downloadFile = (params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        console.log(err)
        reject('Failed to retrieve an object: ' + err)
        return err.message
      } else {
        debug('Loaded ' + data.ContentLength + ' bytes')
        return resolve(data)
      }
    })
  })
}

export const checkFile = (url) => {
  let s3params = {
    Bucket: Meteor.settings.private.UPLOAD_BUCKET,
    Key: url,
  }
  return new Promise((resolve, reject) => {
    s3.getObject(s3params, function (err, data) {
      if (err) {
        console.log(err)
        reject('Failed to retrieve an object: ' + err)
        return err.message
      } else {
        debug('Loaded ' + data.ContentLength + ' bytes')
        return resolve(data)
      }
    })
  })
}

export const deleteFile = (params) => {
  s3.deleteObject(params, function (err, data) {
    if (err) return logger.error(`Error: Could not delete file from s3 ${err}`)

    return logger.info('file deleted from s3', params)
  })
}

export const convertAndUpload = async ({ key, document, encoding }) => {
  let uploadParams = {
    Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
    Key: key,
    Body: Buffer.from(document, encoding),
    ContentType: 'application/pdf',
    CacheControl: 'max-age=0',
  }
  await uploadFile(uploadParams)
  return {
    status: 'success',
    message: `successfully generated file`,
  }
}

export const generateAndUpload = async ({ data, fields }) => {
  try {
    const { type, formData, listingId } = data
    let s3params = {
      Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
      Key: `document-templates/${type}.pdf`,
    }
    const template = await downloadFile(s3params)
    const file = await generatePDF({ data: formData, fields, template: template.Body })

    let uploadParams = {
      Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
      Key: `listing_documents/${listingId}/${type}.pdf`,
      Body: Buffer.from(file),
      ContentType: 'application/pdf',
      CacheControl: 'max-age=0',
    }
    await uploadFile(uploadParams)
    return {
      status: 'success',
      message: `successfully generated ${type} file for listing ${listingId}`,
    }
  } catch (e) {
    return { status: 'failed', message: e }
  }
}
