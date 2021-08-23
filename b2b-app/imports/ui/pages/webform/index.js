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
import { showError, showInfo, showSuccess } from '/imports/ui/utils/toast-alerts'
import Surveys from '/imports/api/surveys/schema'
import Practices from '/imports/api/practices/schema'
import Profiles from '/imports/api/profiles/schema'
import WebformPage from './webform-page'

const FIELDTYPES = {
  text: 'string',
  single: 'checkbox',
  multi: 'checkbox',
}

const debug = require('debug')('app:webformbox')
let push

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading webform...</div>
  return <WebformPage {...props}></WebformPage>
}

const WebformBox = withTracker((props) => {
  const { form, taskId } = props.match.params
  const subs = Meteor.subscribe('id.task.webform', taskId)

  let listingId, listing, survey, signatures, notes, userSigUrl, webDoc

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
    if (['bq', 'botpq', 'sq', 'bnf', 'snf'].includes(task.doctype)) {
      return null
    } else {
      return await meteorCall('task.get.template', null, task.doctype)
    }
  }
  if (task) {
    const job = Jobs.findOne({ _id: task.jobId })
    listingId = job?.listingId
    listing = Listings.findOne(listingId)
  }
  let fieldTypes = {}
  if (listing) {
    webDoc = listing.docs.find((doc) => doc.type === task.doctype)
    debug('webDoc', webDoc)

    survey = Surveys.findOne({ slug: task.doctype, active: true })
    if (survey) {
      survey?.steps.map((step) => {
        return step.questions
          .filter((qs) => {
            return !['paragraph'].includes(qs.type)
          })
          .map((qs) => {
            Array.isArray(qs.answers) &&
              qs.answers.map((answer) => {
                return (fieldTypes[`${qs.id}-${answer.id}`] = FIELDTYPES[qs.type])
              })
          })
      })
    }

    if (webDoc) {
      notes = webDoc.notes.filter((_note) => {
        return _note.name === 'review'
      })
      if (notes.length) {
        notes.map((note) => {
          let profile = Profiles.findOne({ userId: note.who })
          note.who = profile?.nickname || profile?.name || note.who
          return note
        })
      }
      // filter signatures done already
      signatures = webDoc?.signatures?.filter((signature) => {
        return signature.date_signed
      })
    }

    userSigUrl = Profiles.findOne({ userId: userId })?.signature || false
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
      userId: userId,
    }
    // TODO: Get this from the doc-types collection, but probably let the back end work it out (better)
    const approved =
      task.config?.type === 'approve' ||
      ['bq', 'botpq', 'sq', 'bnf', 'snf'].includes(task.doctype)

    const result = await meteorCall('task.webform.complete', null, {
      id: taskId,
      data,
      document,
      approved,
    })

    if (result.status !== 'success') return debug(`${result.message}`)
    debug('completed webform')
    return cusReturnURL()
  }

  const handleDownload = async (file) => {
    saveAs(blobToFile(file), `${CONSTANTS.DOCUMENT_TYPES[task.doctype]}.pdf`)
  }

  const reject = async (note) => {
    let { status } = await meteorCall('reject.webform', null, {
      _id: listingId,
      doctype: task.doctype,
      taskId,
      note,
    })
    if (status === 'success') {
      showInfo(`${CONSTANTS.DOCUMENT_TYPES[task.doctype]} rejected`)
      return goBack()
    }
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

  const addSignature = async ({ signer }) => {
    if (!userSigUrl) {
      return showError(
        'You have not uploaded a signature. Please add a signature in the profile section'
      )
    }

    let form = {
      signer_role: signer.signer_role,
      signature_url: userSigUrl,
      userId: userId,
      id: listingId,
      docType: task.doctype,
    }
    return meteorCall('update.doc.signature', null, form)
  }

  const submitSignature = (sigRef) => {
    const fileName = Meteor.userId() + '-signature.png'
    const folder = 'signature'
    const metaContext = {
      fileName,
      folder,
      listing: Meteor.userId(),
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

  return {
    handleDownload,
    addSignature,
    getTemplate,
    getDoc,
    goBack,
    update,
    reject,
    complete,
    submitSignature,
    listing,
    currentRole,
    task,
    userSigUrl,
    signatures,
    survey,
    practice,
    notes,
    fieldTypes,
    webDoc,
    loading: !subs.ready(),
  }
})(Loading)

export default WebformBox
