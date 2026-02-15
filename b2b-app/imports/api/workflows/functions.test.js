import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { DateTime } from 'luxon'

// import { expect } from 'chai'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const expect = chai.expect

import Factory from '/imports/test/factories'
import Profiles from '/imports/api/profiles/schema'
import Messages from '/imports/api/messages/schema'
import { Tasks } from '/imports/api/workflows/schema'

import { createTestTemplates } from '/imports/test/factory.message-templates'
import { createTestTasks } from '/imports/test/factory.tasks'

import { doMerge } from '/imports/api/utils/merge'
import { notify, optedToSend, taskReplacePersonByRole, getValues } from './functions'
import { expectNotToThrowError } from '/imports/test/chai-expect-throw-error'

const debug = require('debug')('app:workflow-functions-test')

const person = async (role, profile) => {
  const user = await Meteor.users.findOneAsync({ _id: profile.userId })
  return {
    userId: user._id,
    name: profile.name,
    email: user.username,
    mobile: profile.mobile,
    role,
  }
}

context('Workflow functions', () => {
  before(async function (done) {
    this.timeout(10000)
    await resetDatabase()
    await createTestTemplates()
    await createTestTasks()
    done()
  })
  describe('optedToSend function', () => {
    it('checks if person is opted in for receiving SMS', async () => {
      const profiles = await Profiles.find({}).fetchAsync()
      const result = await optedToSend(profiles[0].userId, 'SMS')
      expect(result).to.be.true
    })
  })
  describe('Notify function', () => {
    it('creates a message using notify function', async () => {
      let task = await Tasks.findOneAsync({ slug: 'task-1' }, { hint: 'by_slug' })
      debug('task', task)
      expect(task).to.be.an('object')
      try {
        await notify(task, 'complete')
      } catch (e) {
        expect(e).not.to.be.instanceOf(Error)
      }
      const messages = await Messages.find({}).fetchAsync()
      expect(messages.length).to.be.equal(task.notifications.length)
    })
  })

  describe('doMerge function', () => {
    it('successfully merges the data', () => {
      const body =
        'Dear *|nickname|*, We have now reviewed your Contract of Sale. Our feedback can be accessed via [My Properties] (*|url|*)'
      const context = {
        nickname: 'John Jones',
        url: 'https://www.test.com.au',
        server: 'http://localhost:3090/',
      }
      const template = {
        type: 'EMAIL',
      }
      let result = doMerge({ context, body, template })
      expect(result).to.be.an('array')
      expect(result[0].text.toString()).to.include('Dear John Jones')
      expect(result[0].text.toString()).to.include(
        '[My Properties] (https://www.test.com.au)'
      )
    })
    it('merges a button into the email', () => {
      const body = '{My Properties} (*|url|*)'
      const context = {
        url: 'https://www.test.com.au',
      }
      const template = {
        type: 'EMAIL',
      }
      let result = doMerge({ context, body, template })
      expect(result).to.be.an('array')
      expect(result[1].toString()).to.include('href="https://www.test.com.au')
    })
    it('correctly merges the data and adds the p tags for emails', () => {
      const body =
        'Dear *|nickname|*, \nFirst Line [My documents] (*|url|*) . \nSecond Line'

      const context = {
        nickname: 'John Jones',
        url: 'https://www.test.com.au',
      }
      const template = {
        type: 'EMAIL',
      }
      let result = doMerge({ context, body, template })
      expect(result[1].toString()).to.include('<p>Dear John Jones,')
      expect(result[1].toString()).to.include('</p><p>')
    })
    it('merges correctly when theres no merge fields available', () => {
      const body = 'Dear test, I do not have any fields'
      const context = {
        nickname: 'John Jones',
        url: 'https://www.test.com.au',
      }
      const template = {
        type: '',
      }
      let result = doMerge({ context, body, template })
      expect(result[1]).to.include('Dear test, I do not have any fields')
    })
    it('generates an sms with the fields merged', () => {
      const body =
        'Re: *|address|*\nThe Client Authorisation Form has been submitted by the customer.'
      const context = {
        address: '123 Rainbow road',
      }
      const template = {
        type: 'SMS',
      }
      let result = doMerge({ context, body, template })
      expect(result).to.include(
        'Re: 123 Rainbow road\n' +
          'The Client Authorisation Form has been submitted by the customer.'
      )
    })
    it('generates an email even when theres no fields to merge', () => {
      const body = 'Dear test, I do not have any fields'
      const context = {
        nickname: 'John Jones',
        url: 'https://www.test.com.au',
      }
      const template = {
        type: 'EMAIL',
      }
      let result = doMerge({ context, body, template })
      expect(result[1].toString()).to.include('Dear test, I do not have any fields')
    })
    it('generates an sms', () => {
      const body =
        'Re: *|address|*\nSettlement has been booked on *|settlementdate|*\nPlease ensure all keys are ready for release after settlement.'
      const date = DateTime.local(2022, 12, 10, 8, 30).toFormat('dd LLLL yyyy')
      const context = {
        address: '123 rainbow road',
        settlementdate: date,
      }
      const template = {
        type: 'SMS',
      }

      let result = doMerge({ context, body, template })
      expect(result).to.include(
        'Re: 123 rainbow road\n' +
          'Settlement has been booked on 10 December 2022\n' +
          'Please ensure all keys are ready for release after settlement.'
      )
    })
  })
})

describe('taskReplacePersonByRole function', function () {
  let con1, con2, job

  before(async function () {
    await resetDatabase()
    con1 = await Factory.createAsync('UserBOSS')
    const con1Profile = await Profiles.findOneAsync({ _id: con1._id })
    // debug('con1Profile', con1Profile)
    expect(con1Profile).to.be.an('object')
    con2 = await Factory.createAsync('UserBOSS')
    const con2Profile = await Profiles.findOneAsync({
      _id: con2._id,
    })
    // debug('con2Profile', con2Profile)
    expect(con2Profile).to.be.an('object')

    job = await Factory.createAsync('job', {
      persons: [
        {
          userId: con1._id,
          name: con1Profile.name,
          email: con1.username,
          mobile: con1.mobile,
          role: 'BOSS',
        },
      ],
    })
    debug('job', job)
    expect(job).to.be.an('object')

    const goodTasks = [
      {
        name: 'test1',
        status: 'blocked',
        role: 'BOSS',
        assignedTo: con1._id,
        responsible: con1Profile.name,
      },
      {
        name: 'test2',
        status: 'ready',
        role: 'BOSS',
        assignedTo: con1._id,
        responsible: con1Profile.name,
      },
    ]

    await Promise.all(
      goodTasks.map(async (task) => {
        task.jobId = job._id
        await Factory.createAsync('task', task)
      })
    )
  })

  it('Fails because its missing missing params', async () => {
    const user = {
      userId: con2.userId,
    }
    const result = await expectNotToThrowError(
      async () => await taskReplacePersonByRole({ id: job._id, role: 'BOSS', user })
    )
    expect(result.status).to.be.equal('failed')
  })

  it('successfully replaces user on tasks', async () => {
    const user = {
      userId: con2.userId,
      name: con2.name,
    }
    const result = await taskReplacePersonByRole({ id: job._id, role: 'BOSS', user })
    expect(result.status).to.be.equal('success')
  })
})

describe('getValues function', () => {
  it('successfully gets the data', async function (done) {
    this.timeout(10000)

    const punterProfile = await Factory.createAsync('UserPART')
    const bossProfile = await Factory.createAsync('UserBOSS')
    const peerProfile = await Factory.createAsync('UserPEER')
    const wsadmProfile = await Factory.createAsync('UserWSADM')
    const wsadm = await Meteor.users.findOneAsync({ _id: wsadmProfile.userId })
    // debug('wsadmProfile', wsadmProfile)
    // debug('wsadm', wsadm)

    const persons = []
    persons.push(await person('PART', punterProfile))
    persons.push(await person('BOSS', bossProfile))
    persons.push(await person('PEER', peerProfile))
    persons.push(await person('WSADM', wsadmProfile))
    const job = await Factory.createAsync('participants', {
      slug: 'regular-participant',
      persons,
    })

    // debug('job', job)

    const task = await Factory.createAsync('task', {
      slug: 'form',
      notifications: [],
      assignedTo: punterProfile.userId,
    })
    const result = await getValues({
      job,
      task,
      url: '/ekit',
    })
    // debug(result)
    expect(result).to.be.an('object')
    expect(result.partnickname).to.equal(punterProfile.nickname)
    expect(result.partname).to.equal(punterProfile.name)
    expect(result.bossnickname).to.equal(bossProfile.nickname)
    // Due to a quirk in the way factories work, we can't set the username
    // expect(result.adminemail).to.equal(wsadm.emails[0].address)
    expect(result.adminphone).to.equal(wsadmProfile.mobile)

    done()
  })
})
