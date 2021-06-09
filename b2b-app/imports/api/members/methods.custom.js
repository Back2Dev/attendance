import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import { Promise } from 'meteor/promise'

import Members from '/imports/api/members/schema'
const debug = require('debug')('b2b:members')
// AWS Configs
const aws = require('aws-sdk')
const s3config = new aws.Config({
  accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  region: Meteor.settings.private.S3_REGION,
})
const s3 = new aws.S3(s3config)

Meteor.methods({
  'upload.avatar': (data) => {
    try {
      const user_id = Meteor.userId()
      let s3params = {
        Bucket: Meteor.settings.private.UPLOAD_BUCKET,
        Key: `user-profile-photo/${user_id}/${data.filename}`,
        Body: Buffer.from(data.photo),
        ContentType: 'application/jpg',
        CacheControl: 'max-age=0',
        ACL: 'public-read-write',
      }
      const uploadFile = (params) => {
        return new Promise((resolve, reject) => {
          s3.putObject(params, function (err, data) {
            if (err) {
              debug(err, err.stack) // an error occurred
              reject('Unable to upload file to S3')
            } else {
              debug('sucessfully replaced file in s3') // success
              resolve(data)
            }
          })
        })
      }
      Promise.await(uploadFile(s3params))
      Members.update(
        { userId: user_id },
        {
          $set: {
            avatar: `user-profile-photo/${user_id}/${data.filename}`,
          },
        }
      )
      logger.audit(`Uploaded avatar for user ${user_id}`, data)
      return { status: 'success', message: 'upload successful' }
    } catch (e) {
      logger.error(`Error when uploading avatar: ${e.message}`, data)
      return { status: 'failed', message: `Error when uploading avatar: ${e.message}` }
    }
  },
})
