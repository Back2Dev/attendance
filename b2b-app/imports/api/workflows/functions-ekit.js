import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import Workshops from '/imports/api/workshops/schema'
import Participants from '/imports/api/participants/schema'
import { taskReady, taskComplete } from './functions'

const debug = require('debug')('app:wf:fns-ekit')

export const activateParticipantTask = async ({ jobId, formList }) => {
  try {
    // If formList is provided, it's a list of forms that need to be completed.
    if (formList) {
      const theTasks = await Tasks.find({
        jobId,
        role: { $in: ['PART', 'BOSS', 'PEER'] },
      }).fetchAsync()
      const activatedFormList = formList
        .filter((form) => form.active)
        .map((form) => form.slug)
      // Update tasks based on formList
      for (const pt of theTasks) {
        if (!activatedFormList.includes(pt.slug)) {
          await Tasks.updateAsync(pt._id, { $set: { hidden: true } })
        } else {
          await Tasks.updateAsync(pt._id, { $set: { hidden: false } })
          const orphan =
            pt.depends.length &&
            pt.depends.every((d) => !activatedFormList.includes(d.id))

          if (orphan) {
            await taskReady(pt._id)
          }
        }

        // Find form variant, ex: q18-mutate-sam, q4-David
        const thisForm = formList.find((form) => form.slug === pt.slug)

        if (thisForm) {
          await Tasks.updateAsync(pt._id, { $set: { webform: thisForm.variant } })
        }
      }
    }
    const startTask = await Tasks.findOneAsync({
      jobId,
      status: 'ready',
      slug: 'workshop-materials',
    })
    if (startTask) await taskComplete(startTask._id)
    else debug('workshop-materials task not found')
  } catch (e) {
    throw new Error(e.message)
  }
}

export const activateWorkshop = async (id) => {
  const task = await Tasks.findOneAsync(id)
  // Find the workshop job for this task
  const workshop = await Workshops.findOneAsync({ _id: task.jobId })
  // Then find all the participant jobs for this workshop
  const participants = await Participants.find({
    workshopId: workshop._id,
    jobType: 'participant',
  }).fetchAsync()

  await Promise.all(
    // Start all the tasks...
    participants.map(async (part) => {
      await activateParticipantTask({ jobId: part._id, formList: workshop.formList })
    })
  )
  return { status: 'success', message: 'ok' }
}
