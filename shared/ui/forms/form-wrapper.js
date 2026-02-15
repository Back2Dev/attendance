import React from 'react'
import { Meteor } from 'meteor/meteor'

import { withTracker } from 'meteor/react-meteor-data'
import { Tasks, Jobs } from '/imports/api/workflows/schema'
import Surveys from '/imports/api/surveys/schema'
import Profiles from '/imports/api/profiles/schema'
import Responses from '/imports/api/responses/schema'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import useTaskReady from '/imports/ui/utils/use-task-ready'
import WebformContext from './form-context'
import WebformCore from './core'
import signFuncs from './form-signature'
import smsFuncs from './form-sms'
import formFuncs from './form-funcs'
import FormPageSubNavBar from '../modules/ekit/desktop/form-sub-navbar'
import LoadingComponent from '/imports/ui/components/commons/loading'

const FIELDTYPES = {
  text: 'string',
  single: 'checkbox',
  multi: 'checkbox',
  array: 'string',
}

const debug = require('debug')('app:formWrapper')

const FormInner = (props) => {
  debug({ props })

  const { token } = props.match.params
  useTaskReady({ taskId: token, redirect: true })
  if (props.error) return <div>Error: {props.error}</div>
  if (props.loading)
    return <LoadingComponent loading message={`Loading webform...`} delay={1000} />
  return (
    <WebformContext.Provider value={{ ...props }}>
      <FormPageSubNavBar />
      <WebformCore {...props} />
    </WebformContext.Provider>
  )
}

const FormWrapper = withTracker((props) => {
  try {
    const { token } = props.match.params
    const { push } = props.history
    const subs = Meteor.subscribe('id.task.webform', token)
    const loading = !subs.ready()
    if (loading) {
      debug('Still loading', token)
      return <div>Loading</div>

    }

    let jobId,
      job,
      survey,
      signatures,
      userSigUrl,
      webDoc,
      response,
      slug,
      pdfmakeTemplate
    let notes = []
    let userId = Meteor.userId()
    const profile = Profiles.findOne({ userId: userId })
    const task = Tasks.findOne(token)
    if (task?.error) return { loading: false, error: task?.error }
    const currentRole = localStorage.getItem('viewas')
    if (task) {
      pdfmakeTemplate = PdfTemplates.findOne({ docType: task.webform || task.doctype })
      // ek-514: if pdfmakeTemplate is not found, try to remove '-i' from the doctype
      if (!pdfmakeTemplate && task?.doctype && /-i$/.test(task?.doctype)) {
        const tryNewDoctype = task?.doctype.replace(/-i$/, '')
        debug('Trying new doctype', tryNewDoctype)
        pdfmakeTemplate = PdfTemplates.findOne({ docType: tryNewDoctype })
        debug('Found template', pdfmakeTemplate)
      }

      slug = task.config?.webform ? task.config.webform : task.doctype
      job = Jobs.findOne({ _id: task.jobId })
      if (job) jobId = job._id
    } else {
      // Todo: Find a pdfmakeTemplate for this (if relevant)
      response = Responses.findOne({ _id: token })
      if (response) survey = Surveys.findOne({ _id: response.surveyId })
    }
    debug({ task, profile, response })
    let fieldTypes = {}
    if (job) {
      webDoc = job.docs.find((doc) => {
        return doc.type === task.doctype && doc.taskIds?.includes(task._id)
      })

      // TODO: We may need to remove this fallback later
      // if (!webDoc && ['ekit-q10', 'ekit-q11'].includes(task.doctype)) {
      //   // fallback to old way
      //   webDoc = job.docs.find((doc) => {
      //     return doc.type === task.doctype
      //   })
      // }
      slug = task.webform || task.doctype
      survey = Surveys.findOne({ slug, active: true })
      debug({ slug, survey, webDoc, task })
      if (survey) {
        survey?.steps.map((step) => {
          return step.questions
            ?.filter((qs) => {
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
        notes =
          webDoc.notes?.filter((_note) => {
            return _note.name === 'review'
          }) || []
        if (notes.length) {
          notes.map((note) => {
            let profile = Profiles.findOne({ userId: note.who })
            note.who = profile?.nickname || profile?.name || note.who
            return note
          })
        }
        // filter signatures done already
        signatures =
          webDoc?.signatures?.filter(async (signature) => {
            if (signature.signature_url && signature.date_signed) {
              if (signature.userId === userId) {
                signature.signature_url = await updateSignatureUrl({
                  currentSignature: signature,
                  doctype: task.doctype,
                  jobId,
                  userId,
                })
              }
              return signature
            }
          }) || []
      }
      userSigUrl = Profiles.findOne({ userId: userId })?.signature || false
    }

    const update = async (form) => {
      await Meteor.callAsync('update.webform', {
        id: token,
        doctype: task?.webform,
        form,
      })
    }
    const approveForm = async (status) => {
      await Meteor.callAsync('update.participant.form', {
        jobId: task.jobId,
        slug: task.slug,
        status,
      })
    }

    const sendNotifications = async (params) => {
      return await Meteor.callAsync('send.notifications', params)
    }

    const logit = async (action, status, message, data) => {
      Meteor.callAsync('log.responses', token, { action, status, message, data })
    }
    return {
      ...smsFuncs,
      ...formFuncs,
      ...signFuncs,

      userSigUrl,
      userId: Meteor.userId(),
      signatures,
      task,
      update,
      logit,
      approveForm,
      sendNotifications,
      response,
      job,
      currentRole,
      survey,
      notes,
      fieldTypes,
      webDoc,
      loading,
      ignore: profile?.ignorePreview,
      pdfmakeTemplate,
    }
  } catch (e) {
    console.error(e)
    return { error: e.message }
  }
})(FormInner)

export default FormWrapper
