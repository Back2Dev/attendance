import { Meteor } from 'meteor/meteor'
import { Match, check } from 'meteor/check'
import merge from 'lodash/merge'
import logger from '/imports/lib/log'
import { trimObj } from '/imports/api/utils'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import Surveys from '/imports/api/surveys/schema'
import Responses from '/imports/api/responses/schema'
import progress from '/imports/api/surveys/progress'
import dbg from 'debug'
const debug = dbg('app:methods.forms')

Meteor.methods({
  'update.webform': async function ({ id, doctype, form }) {
    check(id, String)
    check(form, Object)
    const trimmedForm = trimObj(form)
    trimmedForm.clientIP = this.connection.clientAddress
    const survey = await Surveys.findOneAsync({ slug: doctype })
    const perc = survey ? progress({ formData: trimmedForm }, survey) : 0

    // id may be for a task or job...
    const task = await Tasks.findOneAsync(id)
    if (task) {
      const job = await Jobs.findOneAsync(task.jobId)
      let ix = -1
      ix = job.docs.findIndex(
        (doc) => doc.type === task.doctype && doc.taskIds?.includes(task._id)
      )

      // // TODO: We may need  to remove this fallback later
      // if (ix === -1 && task.doctype !== 'ekit-q10') {
      //   // fallback to old  way
      //   ix = job.docs.findIndex((doc) => doc.type === doctype)
      // }

      if (ix !== -1) {
        console.log(`Updating form progress ${doctype} ${perc}`)
        // Save it to the job
        await Jobs.updateAsync(task.jobId, {
          $set: {
            [`docs.${ix}.formData`]: trimmedForm,
            [`docs.${ix}.progress`]: perc,
          },
        })
        if (trimmedForm.q10a?.kp)
          debug(JSON.stringify({ kp: trimmedForm.q10a.kp }, null, 2))
      } // else {} // Shouldn't this push a new document object?
    } else {
      const response = await Responses.findOneAsync(id)
      if (response) {
        await Responses.updateAsync(id, {
          $set: { formData: trimmedForm },
          $push: { logs: { action: 'save' } },
        })
      } else logger.warn('Job or Response not found', { id, doctype, trimmedForm })
    }
  },
})
