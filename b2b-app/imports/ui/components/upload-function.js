import React from 'react'

const debug = require('debug')('app:upload')

const slingshotUpload = ({ metaContext, file }) => {
  try {
    const uploader = new Slingshot.Upload('publicUploads', metaContext)
    uploader.send(file, function (error, downloadUrl) {
      if (error) {
        debug('Error uploading', error)
      } else {
        debug('done uploading')
      }
    })
    return { status: 'success' }
  } catch (e) {
    return { status: 'failed', message: e.error }
  }
}

export default slingshotUpload
