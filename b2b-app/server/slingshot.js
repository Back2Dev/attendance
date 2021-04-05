import { Meteor } from 'meteor/meteor'
const debug = require('debug')('b2b:upload')

Slingshot.fileRestrictions('privateUploads', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
  maxSize: null,
})

/*
 We need to set CORS permissions on the remote buckets for this to work. 
 The documentation provides an XML permission file, but AWS does not
 accept it - perhaps the XML format is no longer supported.
 The way to fix it is to run this command:

 AWS_PROFILE=<profile> node scripts/s3-enable-cors.js <bucket-name> <host> put get options post head delete

 Where <bucket-name> and <host> are the obvious.
 (You may not need to use AWS_PROFILE if you don't use multiple AWS profiles)

 */
Slingshot.createDirective('privateUploads', Slingshot.S3Storage, {
  AWSAccessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  AWSSecretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
  region: Meteor.settings.private.S3_REGION,

  authorize: function () {
    // if (!this.userId) {
    //   const message = 'Please login before posting files'
    //   throw new Meteor.Error('Login Required', message)
    // }
    // return true
  },

  key: function (file, metaContext) {
    let extension = '.pdf'
    if (metaContext.fileName.includes('.')) {
      extension = ''
    }
    const filename = `${metaContext.folder}/${metaContext.listing}/${metaContext.fileName}${extension}`
    debug(`filename for upload is ${filename}`)
    return filename
  },
})

Slingshot.fileRestrictions('documentUploads', {
  allowedFileTypes: ['application/pdf'],
  maxSize: null,
})

Slingshot.createDirective('documentUploads', Slingshot.S3Storage, {
  AWSAccessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  AWSSecretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
  region: Meteor.settings.private.S3_REGION,
  acl: 'public-read',

  authorize: function () {
    return true
  },

  key: function (file, metaContext) {
    let extension = '.pdf'
    if (metaContext.fileName.includes('.')) {
      extension = ''
    }
    const filename = `${metaContext.folder}/${metaContext.listing}/${metaContext.fileName}${extension}`
    debug(`filename for upload is ${filename}`)
    return filename
  },
})

//
// This is a copy, used for public uploads, like avatars
//
Slingshot.fileRestrictions('publicUploads', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
  maxSize: null,
})

Slingshot.createDirective('publicUploads', Slingshot.S3Storage, {
  AWSAccessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
  AWSSecretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  bucket: Meteor.settings.private.UPLOAD_BUCKET,
  region: Meteor.settings.private.S3_REGION,
  acl: 'public-read',

  authorize: function () {
    // if (!this.userId) {
    //   const message = 'Please login before posting files'
    //   throw new Meteor.Error('Login Required', message)
    // }
    return true
  },

  key: function (file, metaContext) {
    let extension = '.pdf'
    if (metaContext.fileName.includes('.')) {
      extension = ''
    }
    const filename = `${metaContext.folder}/${metaContext.listing}/${metaContext.fileName}${extension}`
    debug(`filename for upload is ${filename}`)
    return filename
  },
})
