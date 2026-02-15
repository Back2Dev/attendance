import React from 'react'
import { Meteor } from 'meteor/meteor'

import { meteorCall } from '/imports/ui/utils/meteor'
import { showError, showSuccess } from '/imports/ui/utils/toast-alerts'
import Profiles from '/imports/api/profiles/schema'
import WebformContext from './form-context.js'

const debug = require('debug')('app:form-sig')

export const updateSignatureUrl = async ({
  currentSignature,
  doctype,
  jobId,
  userId,
}) => {
  let { signature } = Profiles.findOne({ userId: userId })
  if (!signature) return currentSignature.signature_url
  if (signature !== currentSignature.signature_url) {
    let form = {
      signature_url: signature,
      userId: userId,
      signer_role: currentSignature.signer_role,
      id: jobId,
      docType: doctype,
    }
    await meteorCall('update.doc.signature', null, form)
    return signature
  }
  return currentSignature.signature_url
}

export const addSignature = async ({ signer }) => {
  const { userSigUrl, task, userId, jobId } = React.useContext(WebformContext)
  if (!userSigUrl) {
    return showError(
      'You have not uploaded a signature. Please add a signature in the profile section'
    )
  }

  const form = {
    signer_role: signer.signer_role,
    signature_url: userSigUrl,
    userId: userId,
    id: jobId,
    docType: task.doctype,
    taskId: task._id,
  }
  return await meteorCall('update.doc.signature', null, form)
}

export const submitSignature = (sigRef) => {
  const { userSigUrl, task, userId, jobId } = React.useContext(WebformContext)
  const fileName = userId + '-signature.png'
  const folder = 'signature'
  const metaContext = {
    fileName,
    folder,
    fileType: 'image',
  }
  const canvas = sigRef.current.getCanvas()
  canvas.toBlob((blob) => {
    const uploader = new Slingshot.Upload('publicUploads', metaContext)
    uploader.send(blob, function (error, downloadUrl) {
      if (error) {
        showError(error)
      } else {
        Meteor.call('uploaded.signature', { fileName, folder }, (err, res) => {
          if (err) {
            showError(err)
          } else {
            showSuccess(res.message)
          }
        })
      }
    })
  })
}

export const uploadSignature = ({ fileName, folder }) => {
  Meteor.call('uploaded.signature', { fileName, folder }, (err, res) => {
    if (err) {
      showError(err)
    } else {
      showSuccess(res.message)
    }
  })
}

const funcs = { uploadSignature, submitSignature, addSignature, updateSignatureUrl }

export default funcs
