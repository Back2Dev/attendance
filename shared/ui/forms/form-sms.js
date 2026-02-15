import React from 'react'
import { meteorCall } from '/imports/ui/utils/meteor'
import WebformContext from './form-context'
const debug = require('debug')('app:form-sms')

export const invalidateSMSCodes = async () => {
  return await meteorCall('invalidate.codes', null, {})
}

export const getSMSCode = async () => {
  const { webDoc, job } = React.useContext(WebformContext)
  await invalidateSMSCodes()
  return await meteorCall('generate.codes', null, {
    jobId: job._id,
    docType: webDoc.type,
  })
}

export const checkSMSCode = async (code) => {
  return await meteorCall('validate.codes', null, {
    letters: code,
  })
}

const smsFuncs = { invalidateSMSCodes, getSMSCode, checkSMSCode }
export default smsFuncs
