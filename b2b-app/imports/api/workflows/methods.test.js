// methods-listing.test.js
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'

import { expect } from 'chai'
import Workflows, { Jobs, Tasks, Stages } from '/imports/api/workflows/schema'
import Factory from '/imports/test/factories'
import { createTestTemplates } from '/imports/test/factory.message-templates'
import MessageTemplates from '/imports/api/message-templates/schema'
import { workflow2md } from './methods.export'
import './methods-plus'

const debug = require('debug')('app:workflows')

const slugs = ['vic-buy']

const henry = Factory.build('user', { name: 'Henry Kissinger' })
const orange = Factory.build('user', { name: 'Agent Orange' })

const initialPeople = [
  { name: henry.name, role: 'PART', methods: ['email', 'sms'], userId: henry._id },
  { name: orange.name, role: 'AGT', methods: ['api'], userId: orange._id },
]

const excludedCollections = ['fieldMaps', 'workflows']

// Tests start here
describe('One Workflow - VIC Buy', async () => {
  await resetDatabase({ excludedCollections })
  let n = 0
  it('Preps stuff', async () => {
    await Factory.createAsync('vic-buy')
    n = n + (await Jobs.removeAsync({}))
    n = n + (await Stages.removeAsync({}))
    n = n + (await Tasks.removeAsync({}))
    debug(`Removed ${n} db entries`)
  })

  it(`Cannot find vic-bad-job job`, async () => {
    const { status, message } = await Meteor.callAsync('start.job', 'vic-bad-job', [])
    expect(status).to.equal('failed')
  })

  const slug = 'vic-buy'
  it(`finds the ${slug} workflow`, async () => {
    const wf = await Workflows.findOneAsync({ slug })
    expect(!!wf).to.equal(true)
  })

  it(`Kicks off a ${slug} job`, async () => {
    const wf = await Workflows.findOneAsync({ slug })
    if (!wf) throw new Error(`Could not find a workflow called ${slug}`)
    const numbers = {
      stages: wf.stages.length,
      steps: wf.stages.reduce((acc, stg) => {
        acc = acc + stg.steps.length
        return acc
      }, 0),
    }
    const participant = await Factory.createAsync('participants')
    const { status, jobId, message } = await Meteor.callAsync(
      'start.job',
      slug,
      initialPeople,
      participant
    )
    debug(`start.job: ${jobId} `, status, message)
    expect(status).to.equal('success')
    if (status === 'success') {
      const actuals = {
        stages: await Stages.find({ jobId }).countAsync(),
        tasks: await Tasks.find({ jobId }, { hint: 'by_jobId' }).countAsync(),
        states: (await Tasks.find({ jobId }, { hint: 'by_jobId' }).fetchAsync()).reduce(
          (acc, step) => {
            acc[step.status] = acc[step.status] ? acc[step.status] + 1 : 1
            return acc
          },
          {}
        ),
      }
      debug('expected,actuals', numbers, actuals)
      expect(numbers.stages).to.equal(actuals.stages)
      expect(numbers.steps).to.equal(actuals.tasks)
      // expect(numbers.steps - 1).to.equal(actuals.states.blocked)
    }
  })
})

describe('Workflows', async () => {
  await resetDatabase({ excludedCollections })
  let n = 0
  it('Preps', async () => {
    n = n + (await Jobs.removeAsync({}))
    n = n + (await Stages.removeAsync({}))
    n = n + (await Tasks.removeAsync({}))
    debug(`Removed ${n} db entries `)
  })

  slugs.forEach((slug) => {
    it(`Kicks off a ${slug} job`, async () => {
      try {
        const participant = await Factory.createAsync('participants')
        const { status, jobId } = await Meteor.callAsync(
          'start.job',
          slug,
          [],
          participant
        )
      } catch (e) {
        expect(e).not.to.be.instanceOf(Error)
      }
    })
  })
})

describe('test workflow MD file generator', () => {
  before(async function () {
    await createTestTemplates()
  })
  it('successfully generates a md file', async () => {
    let workflow = await Factory.createAsync('vic-buy')
    expect(typeof workflow).to.be.equal('object')
    const msgs = await MessageTemplates.find({}).fetchAsync()
    let result = await workflow2md(workflow, msgs)
    expect(typeof result).to.be.equal('string')
    expect(result).to.match(/(?:### Permissons|#### These Notifications)/)
  })
  it('fails to generate a md file due to passing it a bad object', async () => {
    let badWorkflow = { data: 'bad object' }
    try {
      await workflow2md(badWorkflow)
    } catch (e) {
      expect(e).to.be.instanceOf(Error)
    }
  })
})
