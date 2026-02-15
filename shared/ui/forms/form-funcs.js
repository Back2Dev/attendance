import React from 'react'
import WebformContext from './form-context'
import CONSTANTS from '/imports/api/constants'
import { blobToFile } from '/imports/ui/utils/files'
import dbg from 'debug'
const debug = dbg('app:form-funcs')

export const cusReturnURL = () => {
  const { currentRole, job } = React.useContext(WebformContext)
  if (currentRole === 'PART') {
    return push(`/ekit/${job._id}`)
  } else {
    return push(`/next-steps/${job._id}`)
  }
}

export const getDoc = async (job) => {
  const { task } = React.useContext(WebformContext)
  if (job?.docs) {
    const docFound = job.docs.find((doc) => doc.type === task.doctype)
    return await Meteor.callAsync('download.jobDocument', docFound.url)
  }
}

export const complete = async (document) => {
  const { task } = React.useContext(WebformContext)
  // save document to s3
  const data = {
    type: task.doctype,
    jobId: jobId,
    userId: userId, // THIS WILL CAUSE AN EXCEPTION
  }

  // TODO: Get this from the doc-types collection, but probably let the back end work it out (better)
  const approved =
    task.config?.type === 'approve' || CONSTANTS.APPROVED_DOCS.includes(task.doctype)

  if (task?._id) {
    const result = await Meteor.callAsync('task.webform.complete', {
      id: task._id,
      data,
      document,
      approved,
    })
    if (result.status !== 'success') return debug(`${result.message}`)
  }
  debug('completed webform')
  return cusReturnURL()
}

export const handleDownload = (file) => {
  const { task } = React.useContext(WebformContext)
  saveAs(blobToFile(file), `${CONSTANTS.DOCUMENT_TYPES[task.doctype]}.pdf`)
}

export const reject = async (note) => {
  const { task } = React.useContext(WebformContext)
  let { status } = await Meteor.callAsync('reject.webform', {
    _id: task.jobId,
    doctype: task.doctype,
    taskId: task._id,
    note,
  })
  if (status === 'success') {
    showInfo(`${CONSTANTS.DOCUMENT_TYPES[task.doctype]} rejected`)
    return goBack()
  }
}

export const goBack = () => {
  return cusReturnURL()
}

export const update = async (form) => {
  const { task } = React.useContext(WebformContext)
  await Meteor.callAsync('update.webdata', {
    jobId: task.jobId,
    doctype: task.doctype,
    form,
  })
}

export const updateTask = async (form) => {
  await Meteor.callAsync('update.tasks', null, form)
}

export const updateIgnorePreview = async (ignorePreview) => {
  const { profile } = React.useContext(WebformContext)
  await Meteor.callAsync('update.profiles', { ...profile, ignorePreview })
}

const funcs = {
  updateIgnorePreview,
  updateTask,
  update,
  goBack,
  reject,
  handleDownload,
  complete,
  getDoc,
  cusReturnURL,
}
export default funcs
