import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { callAsyncStubbed, callStubbed, stubUser } from '/imports/test/util'
import '/imports/api/workflows/methods-plus'
import '/imports/api/users/server/publications'
import Factory from '/imports/test/factories'
import Workflows, { Tasks, Jobs } from '../workflows/schema'
import { expectNotToThrowError } from '/imports/test/chai-expect-throw-error'
import { callAsyncMethod } from '../utils/client-call-method'

const debug = require('debug')('app:workflows-tasks-test')

context('Task methods', function () {
  describe('Various task tests ', function () {
    before(async function () {
      await resetDatabase()
    })
    let job, admin, wslead
    it('creates the job', async function () {
      this.timeout(3000)
      await expectNotToThrowError(async () => {
        // Create a workflow + job + tasks
        await Factory.createAsync('vic-buy')
        job = await Factory.createAsync('job.vic-buy', {
          persons: [],
          docs: [],
        })
        // create admin profile
        admin = await Factory.createAsync('UserADM')
        debug('Admin profile created', admin)
        expect(admin).to.be.an('object')

        // create a wslead profile
        wslead = await Factory.createAsync('UserWSLEAD')
        debug('WSLead profile created', wslead)
        expect(wslead).to.be.an('object')
      })
    })
    it('Checks method params (bad regex)', async function () {
      const ret = await expectNotToThrowError(async () => {
        return await Meteor.callAsync('task.complete.2', { id: 'bogus' })
      })
      expect(ret?.message).to.equal('ID failed regular expression validation')
      expect(ret?.status).to.equal('failed')
    })
    it('Checks method params (not an object)', async function () {
      const ret = await expectNotToThrowError(async () => {
        return await Meteor.callAsync('task.complete.2', 'bogus')
      })
      expect(ret?.message).to.equal('The first argument of validate() must be an object')
      expect(ret?.status).to.equal('failed')
    })
    // it('Completes the Assign Conveyancer task', async function () {
    //   // Find the task
    //   const task = await Tasks.findOneAsync({ jobId: job._id, slug: 'assign-con' })
    //   expect(task).to.exist
    //   // debug('Completes the CA find ', { job, task })
    //   const ret = await expectNotToThrowError(async () => {
    //     return await callAsyncStubbed({ _id: wslead.userId }, 'task.complete.2', {
    //       id: task._id,
    //     })
    //   })

    //   expect(ret?.message).to.match(/Permission denied/)
    //   expect(ret?.status).to.equal('failed')

    //   // Try again with the admin
    //   const ret2 = await expectNotToThrowError(async () => {
    //     return await callAsyncStubbed({ _id: admin.userId }, 'task.complete.2', {
    //       id: task._id,
    //     })
    //   })
    //   expect(ret2?.message).to.match(/completed/)
    //   expect(ret2?.status).to.equal('success')
    //   // Check the task status is complete
    //   const task2 = await Tasks.findOneAsync(task._id)
    //   expect(task2.status).to.equal('complete')
    // })
    it('Skips the buyer Q ', async function () {
      // Find the task
      const task = await Tasks.findOneAsync({ jobId: job._id, slug: 'buyer-q' })
      expect(task).to.exist
      // debug('Skips the buyer Q find ', { job, task })
      // debug('Skips the buyer Q admin ', { admin })
      const ret = await expectNotToThrowError(async () => {
        return await callAsyncStubbed({ _id: admin.userId }, 'task.skip', {
          id: task._id,
        })
      })
      const task2 = await Tasks.findOneAsync(task._id)
      expect(task2.status).to.equal('skipped')
    })
  })
})
