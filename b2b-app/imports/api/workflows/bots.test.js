import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { resetDatabase } from '/imports/test/util-test'
import { createTeam } from '/imports/test/factory.users'
import Factory from '/imports/test/factories'
import { TaskCheckLogic } from '/imports/api/workflows/bots'
import { taskReplacePersonByRole, nextActions } from '/imports/api/workflows/functions'
import { expect } from 'chai'

import { Jobs, Tasks } from '/imports/api/workflows/schema'
// Import this to ensure task methods are available
import '/imports/api/workflows/methods.tasks'
const debug = require('debug')('app:workflow-task-bots')

describe('Logic evaluation', function () {
  let adminProfile, participant, job
  const goodTasks = [
    {
      name: 'test1',
      slug: 'create-skip',
      status: 'blocked',
      role: 'ADM',
      logic: 'create if job.flag.A skip me',
    },
    {
      name: 'test2',
      status: 'ready',
      role: 'ADM',
      slug: 'reassign',
      logic: 'create if job.flag.A hide me ',
    },
    {
      name: 'Partners only',
      status: 'ready',
      role: 'ADM',
      slug: 'non-partner-hide',
      logic: 'create unless job.title.Partner hide me ',
    },
    {
      name: 'President skips',
      status: 'ready',
      role: 'ADM',
      slug: 'president-skip',
      logic: 'create if job.title.President skip me ',
    },
    {
      name: 'Unchanged task',
      status: 'ready',
      role: 'ADM',
      slug: 'idle',
    },
  ]

  before(async function (done) {
    const db = await resetDatabase()
    adminProfile = await Factory.createAsync('UserADM')

    participant = await Factory.createAsync('UserPART')
    // debug({ admin, ap, u })

    job = await Factory.createAsync('participants', { flag: 'A', is_new: 'Y' })

    await Promise.all([job, adminProfile, db, participant])
    await Promise.all(
      goodTasks.map(async (task) => {
        task.jobId = job._id
        task.assignedTo = adminProfile.userId
        task.responsible = adminProfile.name
        const t = await Factory.createAsync('task', task)
        task._id = t._id
        return t
      })
    )
    done()
  })

  it('Skips the create-skip task', async () => {
    // Execute any logix on the tasks
    await Promise.all(
      goodTasks.map(async (task) => {
        return await TaskCheckLogic(task._id, 'create')
      })
    )
    await nextActions()

    const skipper = await Tasks.findOneAsync(
      goodTasks.find((t) => t.slug === 'create-skip')._id
    )
    expect(skipper.status).to.be.equal('skipped')
  })

  it('Hides the create-skip task', async () => {
    const hider = await Tasks.findOneAsync(
      goodTasks.find((t) => t.slug === 'reassign')._id
    )
    expect(hider.hidden).to.be.equal(true)
  })

  it('Hides the non-partner task', async () => {
    const partner = await Tasks.findOneAsync(
      goodTasks.find((t) => t.slug === 'non-partner-hide')._id
    )
    expect(partner.hidden).to.be.equal(true)
  })

  it('Skips the president task', async () => {
    const presidente = await Tasks.findOneAsync(
      goodTasks.find((t) => t.slug === 'president-skip')._id
    )
    expect(presidente.status).to.be.equal('skipped')
  })

  it('Replaces ADM user on tasks', async () => {
    const user = {
      userId: participant.userId,
      name: participant.name,
    }

    const result = await taskReplacePersonByRole({
      id: job._id,
      role: 'ADM',
      user,
    })
    expect(result.message).to.be.equal('Updated user tasks with new user')
    expect(result.status).to.be.equal('success')
  })
  it('Fails to replaces BOSS user on tasks', async () => {
    const user = {
      userId: participant.userId,
      name: participant.name,
    }

    const result = await taskReplacePersonByRole({
      id: job._id,
      role: 'BOSS',
      user,
    })
    expect(result.message).to.be.equal('Could not update tasks')
    expect(result.status).to.be.equal('failed')
  })
})

//
