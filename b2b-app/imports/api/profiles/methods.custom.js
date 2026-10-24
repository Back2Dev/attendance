import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'

import Profiles from '/imports/api/profiles/schema'
const debug = require('debug')('app:profiles')
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '/imports/api/s3-utils'

Meteor.methods({
  'upload.avatar': async (data) => {
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
      const uploadFile = async (params) => {
        try {
          const data = await s3.send(new PutObjectCommand(params))
          debug('sucessfully replaced file in s3') // success
          return data
        } catch (err) {
          debug(err, err.stack) // an error occurred
          throw 'Unable to upload file to S3'
        }
      }
      await uploadFile(s3params)
      await Profiles.updateAsync(
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
