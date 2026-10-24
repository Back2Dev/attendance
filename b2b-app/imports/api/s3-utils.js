// AWS
import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import { generatePDF } from '/imports/api/utils/pdf-generate'

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const debug = require('debug')('app:workflow-utils')

export const s3 = new S3Client({
  region: Meteor.settings.private.S3_REGION,
  credentials: {
    accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
    secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  },
})

export const uploadFile = async (params) => {
  try {
    const res = await s3.send(new PutObjectCommand(params))
    debug(`Successfully saved file ${params.Key} ${params.ContentType}`) // success
    return res
  } catch (err) {
    debug(err, err.stack) // an error occurred
    throw 'Unable to upload file to S3'
  }
}

export const downloadFile = async (params) => {
  try {
    const data = await s3.send(new GetObjectCommand(params))
    // SDK v3 returns Body as a stream; callers expect a Buffer (as in v2)
    data.Body = Buffer.from(await data.Body.transformToByteArray())
    debug('Loaded ' + data.ContentLength + ' bytes')
    return data
  } catch (err) {
    console.log(err)
    throw 'Failed to retrieve an object: ' + err
  }
}

export const checkFile = (url) =>
  downloadFile({
    Bucket: Meteor.settings.private.UPLOAD_BUCKET,
    Key: url,
  })

export const deleteFile = (params) => {
  s3.send(new DeleteObjectCommand(params))
    .then(() => logger.info('file deleted from s3', params))
    .catch((err) => logger.error(`Error: Could not delete file from s3 ${err}`))
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
