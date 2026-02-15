import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { downloadFile, convertAndUpload } from '/imports/api/s3-utils.js'
import Surveys from '/imports/api/surveys/schema'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import { upsertDocuments } from '/imports/api/listings/functions.js'
import { accessByPath } from '/imports/api/util'
import CONSTANTS from '/imports/api/constants'
import { authenticationCheck } from './utils'
import { checkUpdateJobPermission } from '/imports/api/workflows/utils'
import logger from '/imports/lib/log'

Meteor.methods({
  'docs.download': async (url) => {
    try {
      check(url, String)
      await authenticationCheck()
      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: url,
      }
      const result = await downloadFile(s3params)
      return { status: 'success', message: 'download successful', data: result }
    } catch (err) {
      return { status: 'failed', message: `${err}` }
    }
  },
  'webform.open': async ({ data, document, approved = false }) => {
    try {
      const { jobId, taskId, type, userId } = data
      check(jobId, String)
      check(taskId, Match.Maybe(String))
      check(type, String)
      check(userId, String)
      check(approved, Boolean)
      await authenticationCheck()
      const job = await Jobs.findOneAsync(jobId)
      await checkUpdateJobPermission(job)

      return { status: 'success', message: 'completed webform' }
    } catch (e) {
      console.error(e)
      return { status: 'failed', message: e.message }
    }
  },
  'webform.complete': async ({ data, document, approved = false }) => {
    try {
      const { jobId, taskId, type, userId } = data
      check(jobId, String)
      check(taskId, Match.Maybe(String))
      check(type, String)
      check(userId, String)
      check(approved, Boolean)
      await authenticationCheck()
      const job = await Jobs.findOneAsync(jobId)
      await checkUpdateJobPermission(job)
      // upload to s3
      const key = `job_documents/${jobId}/${taskId ? `${taskId}-` : ''}${type}.pdf`
      if (document) {
        const upload = await convertAndUpload({ key, document })
        if (upload.status !== 'success')
          return Error(`Error when uploading to s3: ${upload.message}`)
        // store document information job
        const form = {
          jobId,
          taskId,
          url: key,
          type: type,
          docName: `${type}.pdf`,
          who: userId,
        }

        if (approved) {
          form.status = 'approved'
        }
        const insert = await upsertDocuments(form)

        if (insert.status !== 'success')
          return Error(`Error when inserting into job: ${insert.message}`)
        //??webform??
      }
      const task = await Tasks.findOneAsync({ _id: taskId })
      const survey = await Surveys.findOneAsync({ slug: task?.webform || type })

      if (job && survey) {
        // Do we need to check for documents required from the survey?
        if (survey['after-docs']) {
          const afterDocs = survey['after-docs']
          const { formData } = job.docs?.find((doc) => type === doc.type)
          const docList = Object.keys(afterDocs)
            .map((attrib) => {
              const value = accessByPath(formData, attrib)
              if (
                value &&
                !['0', 'no'].includes(value) &&
                !job.docs?.find(
                  (doc) => doc.type === 'other' && doc.otherType === afterDocs[attrib]
                )
              ) {
                return {
                  type: 'other',
                  otherType: afterDocs[attrib],
                  when: new Date(),
                  who: Meteor.userId(),
                  status: 'requested',
                }
              }
            })
            .filter((x) => x)
          if (docList.length) {
            job.docs = job.docs.concat(docList)
            const n = await Jobs.updateAsync(jobId, {
              $set: { docs: job.docs },
            })
            if (!n) console.error('Failed to update document list')
          }
        }

        // Are there any post-methods to be called?
        if (survey.actions && survey.actions.postMethod) {
          // Just pass the job id, assume the method knows what to look for
          // No need to await, because server processing may take some time
          const res = await Meteor.callAsync(survey.actions.postMethod, {
            jobId: job._id,
            // relatedDocs: survey.actions.relatedDocs, // Not sure if this is needed any more
            taskId,
          })
          console.log({ [survey.actions.postMethod]: res })
          if (res.status !== 'success') throw new Error(res.message)
        }
      } else {
        logger.error(`Could not find job (${jobId}) or survey (${type})`)
      }
      logger.audit(`webform ${CONSTANTS.DOCUMENT_TYPES[type] || type} complete`, {
        job,
        type,
        jobId,
        userId,
      })
      return { status: 'success', message: 'completed webform' }
    } catch (e) {
      console.error(e)
      return { status: 'failed', message: e.message }
    }
  },
})
