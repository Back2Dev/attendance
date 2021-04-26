import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import CONSTANTS from '/imports/api/constants'
import { saveAs } from 'file-saver'
import { blobToFile } from '/imports/ui/utils/files'
import { meteorCall } from '/imports/ui/utils/meteor'
import Listings from '/imports/api/listings/schema'
import { Tasks, Jobs } from '/imports/api/workflows/schema'
import { showError } from '/imports/ui/utils/toast-alerts'
import Surveys from '/imports/api/surveys/schema'
import Practices from '/imports/api/practices/schema'
import Profiles from '/imports/api/profiles/schema'
import WebformPage from './webform-page'

const FIELDTYPES = {
  text: 'string',
  single: 'checkbox',
  multi: 'checkbox',
}

const debug = require('debug')('se:webformbox')
let push

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading webform...</div>
  return <WebformPage {...props}></WebformPage>
}

const WebformBox = withTracker((props) => {
  const { form, taskId } = props.match.params
  const subs = Meteor.subscribe('id.task.webform', taskId)

  let listingId
  let listing
  let survey
  let signatures
  let isSigner
  let userId = Meteor.userId()
  const task = Tasks.findOne(taskId)
  const practice = Practices.findOne({ state: 'vic', active: true })
  const currentRole = localStorage.getItem('viewas')
  const cusReturnURL = () => {
    if (currentRole === 'CUS') {
      return push(`/properties/${listing._id}`)
    } else {
      return push(`/next-steps/${listing._id}`)
    }
  }

  const getTemplate = async () => {
    const result = await meteorCall('task.get.template', null, task.doctype)
    return result
  }

  if (task) {
    const job = Jobs.findOne({ _id: task.jobId })
    listingId = job?.listingId
    listing = Listings.findOne(listingId)
  }
  let fieldTypes = {}
  if (task && listing) {
    const webDoc = listing.docs.find((doc) => doc.type === task.doctype)
    isSigner = webDoc.signatures.find((user) => user.userId === userId) || false
    signatures = webDoc.signatures.filter((user) => user.date_signed)
    debug('webDoc', webDoc)
    survey = Surveys.findOne({ slug: task.doctype, active: true })
    if (survey) {
      survey?.steps.map((step) => {
        return step.questions
          .filter((qs) => {
            return !['paragraph'].includes(qs.qtype)
          })
          .map((qs) => {
            qs.answers.map((answer) => {
              return (fieldTypes[`${qs.id}-${answer.id}`] = FIELDTYPES[qs.qtype])
            })
          })
      })
    }
  }

  const getDoc = async (listing) => {
    if (listing?.docs) {
      const docFound = listing.docs.find((doc) => doc.type === task.doctype)
      return await meteorCall('download.listingDocument', null, docFound.url)
    }
  }

  const complete = async (document) => {
    // save document to s3
    const data = {
      type: task.doctype,
      listingId: listingId,
      userId: Meteor.userId(),
    }
    const result = await meteorCall('task.webform.complete', null, {
      id: taskId,
      data,
      document,
    })
    // complete step and return to previous page
    if (result.status !== 'success') return debug(`${result.message}`)
    debug('completed webform')
    return cusReturnURL()
  }

  const handleDownload = async (file) => {
    saveAs(blobToFile(file), `${CONSTANTS.DOCUMENT_TYPES[task.doctype]}.pdf`)
  }

  const goBack = () => {
    return cusReturnURL()
  }

  const update = async (form) => {
    await meteorCall('update.webdata', 'updating', {
      listingId,
      doctype: task.doctype,
      form,
    })
  }

  const addSignature = async () => {
    const userSigUrl = Profiles.findOne({ userId: userId })?.signature
    if (!userSigUrl) {
      return showError(
        'You have not uploaded a signature. Please add a signature in the profile section'
      )
    }
    let form = {
      ...isSigner,
      signature_url: userSigUrl,
      id: listingId,
      docType: task.doctype,
    }
    return meteorCall('update.doc.signature', null, form)
  }

  return {
    handleDownload,
    addSignature,
    getTemplate,
    getDoc,
    goBack,
    update,
    complete,
    listing,
    currentRole,
    task,
    isSigner,
    signatures,
    survey,
    practice,
    fieldTypes,
    loading: !subs.ready(),
  }
})(Loading)

export default WebformBox
