import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'

import { ValidatedMethod } from 'meteor/back2dev:validated-method'
import { RegExId } from '/imports/api/utils/schema-util'
import logger from '/imports/lib/log'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import Listings from '/imports/api/listings/schema'
import Profiles from '/imports/api/profiles/schema'
import { convertAndUpload } from '/imports/api/s3-utils.js'
import { upsertDocuments } from '/imports/api/listings/functions.js'
import { downloadFile, downloadTextFile, getPresignedURL } from '/imports/api/s3-utils.js'
import {
  taskComplete,
  taskOpen,
  taskSkip,
  taskSkipall,
  taskActivate,
  taskReady,
  taskBlock,
  taskReopen,
  taskReject,
  taskNotify,
  taskCompleteNote,
  taskReopenNote,
  taskDeleteNote,
  taskSwitch,
  taskHide,
  taskShow,
  setTaskStatus,
  taskHideToggle,
  updateWebform,
  taskRemove,
} from './functions'
import { getConveyancer } from '/imports/api/listings/utils.js'
import stepsMeta from '/imports/api/workflows/steps-meta'
import { checkTaskPermission, authenticationCheck } from './utils'
// import { checkUpdateJobPermission } from '/imports/api/listings/utils' // there is no such export
import { hasRole } from '/imports/api/users/utils'
import { sendTrigger } from '../messages/functions'

const debug = require('debug')('app:tasks')

Meteor.methods({
  'task.assign.complete': async ({ id, args: { listingId, profileId } }) => {
    try {
      check(id, String)
      check(listingId, String)
      check(profileId, String)

      const user = await Meteor.userAsync()
      if (!(await hasRole(user, 'ADM')) && !(await hasRole(user, 'PM'))) {
        throw new Meteor.Error('Permission denied (task.assign.complete)')
      }
      const { name, mobile, userId } = await Profiles.findOneAsync({ _id: profileId })
      const pm = await Profiles.findOneAsync({ userId: Meteor.userId() })
      const pmName = pm?.name
      if (!name) return new Error(`Could not find user with id ${profileId}`)
      const listing = await Listings.findOneAsync({ _id: listingId })
      if (!listing) return new Error(`Could not find listing with id ${listingId}`)
      let n = 0
      if (await Listings.findOneAsync({ _id: listingId, 'persons.role': 'WSADM' })) {
        n = await Listings.updateAsync(
          { _id: listingId, 'persons.role': 'WSADM' },
          {
            $set: {
              'persons.$.name': name,
              'persons.$.userId': userId,
              'persons.$.mobile': mobile,
              'persons.$.email': (
                await Meteor.users.findOneAsync({ _id: userId })
              ).username,
            },
          }
        )
        n =
          n +
          (await Jobs.updateAsync(
            { listingId, 'persons.role': 'WSADM' },
            {
              $set: {
                'persons.$.name': name,
                'persons.$.userId': userId,
                'persons.$.mobile': mobile,
                'persons.$.email': (
                  await Meteor.users.findOneAsync({ _id: userId })
                ).username,
              },
            }
          ))
      } else {
        const conveyancer = {
          name: name,
          userId: userId,
          mobile: mobile,
          email: (await Meteor.users.findOneAsync({ _id: userId })).username,
          role: 'WSADM',
        }
        n = await Listings.updateAsync(
          { _id: listingId },
          {
            $push: {
              persons: conveyancer,
            },
          }
        )
        n =
          n +
          (await Jobs.updateAsync(
            { listingId },
            {
              $push: {
                persons: conveyancer,
              },
            }
          ))
      }
      const job = await Jobs.findOneAsync({ listingId }, { hint: 'by_listingId' })
      if (!job) return { status: 'failed', message: 'No job found for this property' }
      n =
        n +
        (await Tasks.updateAsync(
          { role: 'WSADM', jobId: job._id },
          { $set: { assignedTo: userId, responsible: name } },
          { multi: true }
        )) // Assign the conveyancer to all tasks
      n =
        n +
        (await Tasks.updateAsync(
          { role: 'PM', jobId: job._id },
          { $set: { assignedTo: Meteor.userId(), responsible: pmName } },
          { multi: true }
        )) // Assign the PM to all tasks
      debug(`${n} tasks updated`)
      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }
      return { status: 'success', message: `Successfully assigned conveyancer ${name}` }
    } catch (e) {
      logger.error(`Error when assigning conveyancer: ${e.message}`, {
        listingId,
        profileId,
      })
      return { status: 'failed', message: e.message }
    }
  },

  'task.upload.approve': async ({ listingId, taskId, doctype }) => {
    check(listingId, String)
    check(taskId, String)
    check(doctype, String)
    await checkTaskPermission({ id: taskId, listingId }, 'update')
    await Listings.updateAsync(
      { _id: listingId, 'docs.type': doctype },
      { $set: { 'docs.$.status': 'approved' } }
    )
    const { status, message } = await taskComplete(taskId)
    return { status, message }
  },

  'task.upload.decline': async ({ listingId, taskId, doctype }) => {
    check(listingId, String)
    check(taskId, String)
    check(doctype, String)

    await checkTaskPermission({ id: taskId, listingId }, 'update')

    await Listings.updateAsync(
      { _id: listingId, 'docs.type': doctype },
      { $set: { 'docs.$.status': 'rejected' } }
    )

    const { status, message } = await taskReject(taskId, `${doctype} is rejected`)
    if (status !== 'success') return { status, message }
    logger.audit('Document declined', { listingId, taskId, doctype })
    return { status: 'success', message: 'declined documents' }
  },

  'task.upload.complete': async ({
    id,
    args: { complete, fileName, listing: listingId, folder, fileType },
  }) => {
    try {
      check(id, String)
      check(complete, Boolean)
      check(fileName, String)
      check(listingId, String)
      check(folder, String)
      check(fileType, Match.Maybe(String))

      await checkTaskPermission({ id, listingId }, 'update')

      const listing = await Listings.findOneAsync({ _id: listingId })
      if (!listing) return new Error(`Could not find listing with id ${listingId}`)
      if (
        await Listings.findOneAsync({
          _id: listingId,
          'docs.type': `${fileType}`,
        })
      ) {
        await Listings.updateAsync(
          { _id: listingId, 'docs.type': `${fileName}` },
          {
            $set: {
              'docs.$.docName': `${fileName}.pdf`,
              'docs.$.who': Meteor.userId(),
              'docs.$.url': `${folder}/${listingId}/${fileName}.pdf`,
            },
          }
        )
      } else {
        await Listings.updateAsync(
          { _id: listingId },
          {
            $push: {
              docs: {
                status: 'draft',
                who: Meteor.userId(),
                docName: `${fileName}.pdf`,
                type: `${fileType}`,
                url: `${folder}/${listingId}/${fileName}.pdf`,
                when: new Date(),
              },
            },
          }
        )
      }
      if (complete) {
        const { status, message } = await taskComplete(id)
        if (status !== 'success') return { status, message }
      }
      logger.audit('file uploaded', {
        taskId: id,
        listingId,
        folder,
        fileType,
        user: Meteor.userId(),
      })
      return { status: 'success', message: 'Successfully uploaded document' }
    } catch (e) {
      logger.error(`Error when uploading file: ${e.message}`, { id, listingId })
      return { status: 'failed', message: e.message }
    }
  },
  //return a url to customer
  'task.download.URL': async ({ args: { url, Expires = 60 } }) => {
    try {
      check(url, String)
      check(Expires, Number)
      await authenticationCheck()
      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: url,
        Expires,
      }

      return {
        status: 'success',
        message: 'downloaded file',
        data: await getPresignedURL(s3params),
      }
    } catch (err) {
      return { status: 'failed', message: `${err}` }
    }
  },
  //return a file to customer
  'task.download.complete': async ({ args: { url } }) => {
    try {
      check(url, String)
      await authenticationCheck()
      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: url,
      }
      return {
        status: 'success',
        message: 'downloaded file',
        data: await downloadFile(s3params),
      }
    } catch (err) {
      return { status: 'failed', message: `${err}` }
    }
  },

  'task.get.template': async (doctype) => {
    // DEPRECATED - WE NO LONGER STORE THESE IN S3
    throw new Meteor.Error('DEPRECATED - WE NO LONGER STORE PDF TEMPLATES IN S3')
    try {
      check(doctype, String)
      await authenticationCheck()

      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: `document-templates/${doctype}.pdf`,
      }
      const result = await downloadFile(s3params)
      return { status: 'success', data: result }
    } catch (e) {
      return { status: 'failed', message: `Error when retrieving template: ${e.message}` }
    }
  },
  'task.get.pdfmake-template': async (doctype) => {
    // DEPRECATED - WE NO LONGER STORE THESE IN S3
    throw new Meteor.Error('DEPRECATED - WE NO LONGER STORE PDF TEMPLATES IN S3')
    try {
      check(doctype, String)
      await authenticationCheck()
      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: `document-templates/pdfmake-${doctype}.js`,
      }
      const result = await downloadTextFile(s3params)
      return { status: 'success', data: result }
    } catch (e) {
      console.error(e)
      return { status: 'failed', message: `Error when retrieving template: ${e.message}` }
    }
  },
  'task.approve.complete': async (id) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')
      const { status, message } = await taskComplete(id)
      if (status !== 'success')
        return logger.error(`Error when approving task: ${message}`)
      return { status: 'success', message: 'approved documents' }
    } catch (e) {
      logger.error(`Error when approving task: ${e.message}`, { id })
      return { status: 'failed', message: e.message }
    }
  },
  'task.decline.complete': async ({ id, note }) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')
      const { status, message } = await taskReject(id, note)
      if (status !== 'success') return { status, message }
      // await Tasks.updateAsync(id, { $set: { status: 'rejected' } })
      // updateJob(id)
      logger.audit('document declined', { taskId: id })
      return { status: 'success', message: 'declined documents' }
    } catch (e) {
      logger.error(`Error when declining document: ${e.message}`, { id })
      return { status: 'failed', message: e.message }
    }
  },

  'task.notifications.complete': async (id) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')
      const task = await Tasks.findOneAsync(id)
      if (!task) {
        return { status: 'failed', message: `Could not find a task with id ${id}` }
      }
      // send message
      const { status, message } = await taskComplete(id)
      if (status !== 'success')
        return logger.error(`Error when completing notification task ${message}`)
      logger.audit('Sent notifications', { taskId: id })
      return { status: 'success', message: 'sent notifications' }
    } catch (e) {
      logger.error(`Error when sending notifications: ${e.message}`, id)
      return { status: 'failed', message: e.message }
    }
  },
  'task.sign.doc': async ({ id, form }) => {
    check(id, String)
    check(form.userId, String)
    await authenticationCheck()
    const listing = await Listings.findOneAsync(id)
    // checkUpdateJobPermission(listing) // there is no such function

    const profile = await Profiles.findOneAsync({ userId: form.userId })
    if (!profile || profile.status !== 'active')
      return { status: 'failed', message: 'Customer has no profile, or is not active' }

    const signatureURL = profile?.signature
    if (!signatureURL) return { status: 'failed', message: 'User is missing a signature' }

    const doc = form.docType
    // TODO: Not sure what this is supposed to be doing
    if (!doc.signatures)
      doc.signatures = [{ userId: form.userId, name: profile.name, signer_role: 'CUS1' }]
    // END OF HACK
    doc.signatures?.map((signature) => {
      if (signature.userId === form.userId) {
        signature.signature_url = signatureURL
        signature.date_signed = Date.now()
      }
      return signature
    })

    await Listings.updateAsync(
      { _id: id, 'docs.type': form.docType.type },
      { $set: { 'docs.$': doc } }
    )
    return { status: 'success', message: 'customer signed document' }
  },
  async 'task.upload.submit'({ id, taskId, form, document }) {
    try {
      check(id, String)
      check(taskId, String)
      await checkTaskPermission({ id: taskId, listingId: id }, 'update')

      const upload = await Meteor.callAsync('signed.doc.upload', { id, form, document })
      debug('upload', upload)
      if (upload.status !== 'success') return upload
      if (taskId) {
        const { status, message } = await taskComplete(taskId)
        if (status !== 'success') return { status, message }
      }

      return { status: 'success', message: 'customer signed document' }
    } catch (e) {
      logger.error('Error when completing signing task', { id })
      return { status: 'failed', message: e.message }
    }
  },
  'task.sign.complete': async ({ id, data, document }) => {
    try {
      const { listingId, type, userId } = data

      check(id, String)
      check(listingId, String)
      check(type, String)
      check(userId, String)
      await checkTaskPermission({ id, listingId }, 'update')

      // upload to s3
      const key = `listing_documents/${listingId}/${type}.pdf`
      const upload = await convertAndUpload({ key, document })
      if (upload.status !== 'success')
        return Error(`Error when uploading to s3: ${upload.message}`)
      // store document information listing
      const form = {
        jobId: listingId,
        url: `listing_documents/${listingId}/${type}.pdf`,
        type: type,
        docName: `${type}.pdf`,
        who: userId,
      }

      const insert = await upsertDocuments(form)
      if (insert.status !== 'success')
        return Error(`Error when inserting into listing: ${insert.message}`)

      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }

      return { status: 'success', message: 'customer signed document' }
    } catch (e) {
      logger.error('Error when completing signing task', { taskId: id })
      return { status: 'failed', message: e.message }
    }
  },
  async 'task.webform.complete'({ id, data, document, approved = false }) {
    try {
      check(id, String)
      check(approved, Boolean)

      const task = await Tasks.findOneAsync(id)
      if (!task) {
        return { status: 'failed', message: `Could not find a task with id ${id}` }
      }
      data.taskId = id
      data.jobId = task.jobId

      const token = !data.userId ? id : ''
      // check for token, if it exists, then we need to check if the token is equal to the task _id
      if (token) {
        if (token !== task._id) {
          return { status: 'failed', message: 'Invalid token' }
        }
        // check if the task can be completed anonymously
        if (!task.config.allowAnonymous) {
          return { status: 'failed', message: 'User must be logged in' }
        }
        // set the current user as task's assignedTo value
        debug({ ass: task.assignedTo, token })
        if (task.assignedTo) {
          this.setUserId(task.assignedTo)
          data.userId = task.assignedTo
        }
      }

      await checkTaskPermission({ id }, 'update')
      if (!document)
        return {
          status: 'failed',
          message: 'No document provided to task.webform.complete',
        }

      const update = await Meteor.callAsync('webform.complete', {
        data,
        document,
        approved,
      })
      debug('task.webform.complete update', update)

      if (update?.status !== 'success') throw new Error(update.message)

      if (task.type === 'multi') {
        const target = (task.docConfig || []).find((dc) => dc.doctype === data.type)

        if (target) {
          // TODO: index is undefined
          // task[index].completedAt = new Date()
          // task[index].completedBy = Meteor.userId()
          target.completedAt = new Date()
          target.completedBy = Meteor.userId()
        } else {
          // TODO: This should never happen, so why are we adding a step to docConfig?
          task.docConfig = [
            ...(task.docConfig || []),
            {
              doctype: data.type,
              action: 'webform',
              name: task.name,
              completedAt: new Date(),
              completedBy: Meteor.userId(),
            },
          ]
        }
        debug(task.docConfig)
        await Tasks.updateAsync(id, { $set: { docConfig: task.docConfig } })
      }

      const { status, message } = await taskComplete(id, { touch: true })
      logger.audit(`Doc-type: ${data.type} webform is completed `, {
        taskId: id,
      })
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'completed webform' }
    } catch (e) {
      console.error(e)
      logger.error(`Error ${e.message} when completing webform task: ${id}`)
      return { status: 'failed', message: e.message }
    }
  },
  'task.webform.update': async ({ id, webform }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await updateWebform(id, webform)
  },
  'task.nextstage.complete': async ({ id, args }) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')
      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'completed webform' }
    } catch (error) {
      console.error(e)
      logger.error('Error when completing next stage', { id })
      return { status: 'failed', message: error.message }
    }
  },
  'task.external.submit': async ({ id, args: { external } }) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')

      // Where should this data go? Probably to the listing, not the task
      await Tasks.updateAsync(id, { $set: { external } })
      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'submitted external task' }
    } catch (e) {
      logger.error(`Error when trying to submit external task: ${e.message}`, {
        id,
        data: external,
      })
      return { status: 'failed', message: e.message }
    }
  },
  'task.external.save': async ({ id, args: { external } }) => {
    try {
      check(id, String)
      await checkTaskPermission({ id }, 'update')
      // Where should this data go? Probably to the listing, not the task
      await Tasks.updateAsync(id, { $set: { external } })
      return { status: 'success', message: 'saved external task' }
    } catch (e) {
      logger.error(`Error when saving external task: ${e.message}`, {
        id,
        data: external,
      })
      return { status: 'failed', message: e.message }
    }
  },
  'task.settlement.date': async ({ id, listingId, date }) => {
    try {
      check(id, String)
      check(listingId, String)
      await checkTaskPermission({ id, listingId }, 'update')

      await Listings.updateAsync(
        { _id: listingId },
        {
          $set: {
            settlementDate: date,
          },
        }
      )
      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'Updated settlement time and date' }
    } catch (e) {
      logger.error(`Error when updating settlement time and date: ${e.message}`, {
        id,
        listingId,
      })
      return { status: 'failed', message: e.message }
    }
  },
  'task.registration.date': async ({ id, listingId, date }) => {
    try {
      check(id, String)
      check(listingId, String)
      await checkTaskPermission({ id, listingId }, 'update')

      await Listings.updateAsync(
        { _id: listingId },
        {
          $set: {
            registrationDate: date,
          },
        }
      )
      const { status, message } = await taskComplete(id)
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'Updated registration date' }
    } catch (e) {
      logger.error(`Error when updating registration date: ${e.message}`, {
        id,
        listingId,
      })
      return { status: 'failed', message: e.message }
    }
  },

  'task.skip.note': async ({ id, args: { note } }) => {
    check(id, String)
    check(note, String)
    await checkTaskPermission({ id }, 'update')
    return await taskSkip(id, note)
  },
  'task.ready.note': async ({ id, args: { note } }) => {
    check(id, String)
    check(note, String)
    await checkTaskPermission({ id }, 'update')
    return await taskReady(id, note)
  },
  'task.block.note': async ({ id, args: { note } }) => {
    check(id, String)
    check(note, String)
    await checkTaskPermission({ id }, 'update')
    return await taskBlock(id, note)
  },
  'task.complete.note': async ({ id, args: { note, notifyUsers = true } }) => {
    check(id, String)
    check(note, String)
    check(notifyUsers, Boolean)
    await checkTaskPermission({ id }, 'update')

    const res = await taskCompleteNote({ id, note, notifyUsers })
    return res
  },
  'task.reopen.note': async ({ id, args: { note, notifyUsers } }) => {
    check(id, String)
    check(note, String)
    check(notifyUsers, Boolean)
    await checkTaskPermission({ id }, 'update')

    return await taskReopenNote({ id, note, notifyUsers })
  },
  'task.delete.note': async ({ id, args: { note } }) => {
    check(id, String)
    check(note, String)
    await checkTaskPermission({ id }, 'update')
    return await taskDeleteNote(id, note)
  },
  'task.remove': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskRemove(id)
  },
  'task.question.submit': async ({ id, listingId, form, params }) => {
    try {
      check(id, String)
      check(listingId, String)
      await checkTaskPermission({ id, listingId }, 'update')

      const task = await Tasks.findOneAsync(id)
      if (!task) {
        return { status: 'failed', message: `Could not find a task with id ${id}` }
      }
      if (task.type !== 'question') {
        return { status: 'failed', message: 'Task type should be of type question' }
      }
      if (!task?.config?.postAction) {
        return { status: 'failed', message: 'Configuration problem: no action available' }
      }
      const listing = await Listings.findOneAsync(listingId)
      if (!listing) throw new Meteor.Error('Could not find listing')
      const responses = listing.responses || []
      let response = responses.find((r) => r.slug === task.slug)
      if (!response) {
        response = { slug: task.slug }
        responses.push(response)
      }
      response.formData = form
      response.when = new Date()
      response.who = Meteor.userId()
      await Listings.updateAsync(
        { _id: listingId },
        {
          $set: { responses },
        }
      )
      const { status, message } = await taskComplete(id)
      let { method, trigger } = task?.config?.postAction
      if (!form.proceed || form.proceed === 'no') {
        method = ''
      }
      if (method) await Meteor.callAsync(method, params)
      if (trigger) {
        const conveyancerId = getConveyancer(listing).userId
        const conveyancer = await Meteor.users.findOneAsync(conveyancerId)
        const conveyancerProfile = await Profiles.findOneAsync({ userId: conveyancerId })
        const sendTriggerResult = await sendTrigger({
          slug: trigger,
          listingId,
          people: [{ ...conveyancerProfile, ...conveyancer }],
          data: {
            purchaseDecision: form.proceed === 'yes' ? 'proceed with' : 'withdraw',
            url: Meteor.absoluteUrl('properties'),
          },
        })
        if (sendTriggerResult.status === 'failed') return sendTriggerResult
      }
      if (status !== 'success') return { status, message }
      return { status: 'success', message: 'submitted question task' }
    } catch (e) {
      logger.error(`Error when trying to submit question task: ${e.message}`, {
        id,
        data: form,
      })
      return { status: 'failed', message: e.message }
    }
  },

  //
  // NB - The following methods are 'pure' workflow methods. THEY CANNOT take additional parameters
  //
  'task.complete': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    const res = await taskComplete(id)
    return res
  },
  'task.skip': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskSkip(id)
  },
  'task.skipall': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskSkipall(id)
  },
  'task.open': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskOpen(id)
  },
  'task.activate': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskActivate(id)
  },
  'task.ready': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskReady(id)
  },
  'task.reopen': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskReopen(id)
  },
  'task.goto': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskReopen(id)
  },
  'task.switch': async ({ id, userId, name }) => {
    check(id, String)
    check(userId, String)
    check(name, String)
    await checkTaskPermission({ id }, 'update')
    return await taskSwitch(id, userId, name)
  },
  'task.hide': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskHide(id)
  },
  'task.hide.toggle': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskHideToggle(id)
  },
  'task.show': async ({ id }) => {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    return await taskShow(id)
  },
  // Note: deliberately renamed this to be slightly different from the methods above, as this is NOT an action
  'task-notify-admin': async ({ id, trigger = '*', force = false, notiReceivers }) => {
    check(id, String)
    check(trigger, String)
    check(notiReceivers, Match.Maybe(Object))
    await checkTaskPermission({ id }, 'update')
    return await taskNotify(id, trigger, force, notiReceivers)
  },

  // TODO: Revisit this
  'task.activateWorkshop': async ({ id }) => {
    try {
      const task = await Tasks.findOneAsync(id)
      activateWorkshop(task)
      return { status: 'success', message: 'Successfully activated workshop' }
    } catch (e) {
      return { status: 'failed', message: e.message }
    }
  },
})

// This looks like a special just for testing :)
export const taskComplete2 = new ValidatedMethod({
  name: 'task.complete.2',
  schema: {
    id: RegExId,
  },
  async validate(...args) {
    const { id } = args[0]
    // if (!Meteor.userId()) {
    // console.log(this)
    if (!Meteor.userId()) {
      return { status: 'failed', message: 'Please login' }
    }
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: 'Task not found' }
    if (task.assignedTo !== id) {
      const meta = stepsMeta.find((meta) => meta.type === task.type)
      if (!meta)
        return {
          status: 'failed',
          message: `Permission denied (no meta for ${task.type})`,
        }
      const completeAction = meta.complete
      if (task.permissions[completeAction]) {
        const allowed = task.permissions[completeAction]
        const roles = await Roles.getRolesForUserAsync(Meteor.userId())
        // debug({ allowed, roles })
        if (!allowed || allowed.length === 0)
          console.log(`Task completion ${completeAction} does not allow any roles`)
        if (!allowed.filter((element) => roles.includes(element)).length)
          return {
            status: 'failed',
            message: `Permission denied (roles: ${roles.join()} not allowed to ${completeAction})`,
          }
      } else
        return {
          status: 'failed',
          message: `Permission denied (no permission for action: "${completeAction}")`,
        }
    }
    // return { status: 'success' }
  },
  async run({ id }) {
    check(id, String)
    await checkTaskPermission({ id }, 'update')
    const res = await taskComplete(id)
    debug('res', res)
    return res
  },
})
