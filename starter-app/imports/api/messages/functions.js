import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import moment from 'moment'
import Messages from './schema'
import { getCfgs } from '/imports/api/settings/server/helper'
import Transporter from './server/transports'
import { push } from '/imports/api/notifications/server/helper'
import HTMLTemplate from '/imports/api/email-template'
import { convertMergeTags, convertLink } from '/imports/api/util.js'
import MessageTemplates from '/imports/api/message-templates/schema'
import { Match, check } from 'meteor/check'
const debug = require('debug')('b2b:messages')

export const findBykeyword = ({ data, keyword }) => {
  const roles = 'AGT BRK CUS CON'.split(/\s+/)

  if (roles.find((role) => role === keyword)) {
    return data.persons
      .filter((p) => p.role === keyword)
      .map((p) => {
        return p.name
      })
      .join(', ')
  }

  return data[keyword]
}

export const findAndReplace = ({ data, template }) => {
  const filler = {}
  let message = template.body
  template.body.match(/\`(\w+)\`/g).map((key) => {
    const keyword = key.replace(/\`/g, '')
    filler[keyword] = findBykeyword({ data, keyword })
  })
  Object.keys(filler).forEach((fill) => {
    message = message.replace(`\`${fill}\``, filler[fill])
  })
  return message
}

export const getTemplate = (slug) => {
  const template = MessageTemplates.findOne({ slug: slug })
  return template
}

export const createSMS = (form) => {
  if (!Match.test(form, Match.ObjectIncluding({ to: String, body: String }))) {
    logger.error('Invalid form data', form)
    return { status: 'failed', message: 'Invalid form data' }
  }

  try {
    debug('creating sms')
    const { to, body } = form
    // Create the form
    let sms = {
      type: 'sms',
      to: to,
      subject: 'message from Mydomain',
      body: body,
      data: {
        recipient: to,
        sender: 'Mydomain',
        message: body,
      },
    }
    return Meteor.call('insert.messages', sms)
  } catch (e) {
    logger.error(`Error when creating sms: ${e.message}`)
    return { status: 'failed', message: `Failed to generate SMS because: ${e.message}` }
  }
}

export const createEmail = (form, subject) => {
  debug('creating email')
  if (!Match.test(form, Match.ObjectIncluding({ to: Array, body: String }))) {
    logger.error('Invalid form data', form)
    return { status: 'failed', message: 'Invalid form data' }
  }

  if (!Match.test(subject, String)) {
    return { status: 'failed', message: 'invalid subject' }
  }

  try {
    const { to, body } = form
    let merged = HTMLTemplate.replace('*|contents|*', body).replace(
      '*|subject|*',
      subject || ''
    )
    const data = {
      to: to,
      html: merged,
      subject: subject || '',
      from_email: form.from ? form.from : 'do-not-reply@mydomain.com.au',
      from_name: 'Settle Easy',
      headers: { 'Reply-To': 'do-not-reply@mydomain.com.au' },
      recipient_metadata: [
        {
          rcpt: form.from ? form.from : 'do-not-reply@mydomain.com.au',
          values: { some: 'value' },
        },
      ],
      important: true,
    }

    const message = {
      to: to[0].email,
      body,
      data,
      subject: subject || '',
      type: 'email',
    }
    return Meteor.call('insert.messages', message)
  } catch (e) {
    logger.error(`Error when creating email: ${e.message}`)
    return { status: 'failed', message: e.message }
  }
}

export const createApp = (form, person, template, listingId, taskId) => {
  debug('creating in app notification')
  if (!Match.test(form, Match.ObjectIncluding({ data: Object, body: String }))) {
    logger.error('Invalid form data', form)
    return { status: 'failed', message: 'Invalid form data' }
  }

  if (!Match.test(person, Match.ObjectIncluding({ userId: String, name: String }))) {
    logger.error('Invalid person data', person)
    return { status: 'failed', message: 'Invalid persons data' }
  }

  if (!Match.test(template, Object)) {
    logger.error('Invalid template data', template)
    return { status: 'failed', message: 'Invalid template data' }
  }

  if (!Match.test(listingId, String)) {
    logger.error('Invalid listingId', listingId)
    return { status: 'failed', message: 'invalid listingId' }
  }

  try {
    const { data, body } = form
    data.user = {
      name: person.name,
    }
    let url = template.url
      ? convertLink(template.url, {
          id: listingId,
          taskId,
        })
      : null
    // send message
    const pushMessage = push({
      userId: person._id || person.userId,
      message: body,
      data: data,
      url,
    })

    if (pushMessage.status === 'failed')
      return logger.error(`Error when creating in app message: ${pushMessage.message}`)

    logger.audit(`Inserted in app message: notificationID: ${pushMessage.notificationId}`)
    return pushMessage
  } catch (e) {
    logger.error(`Error when creating in app message: ${e.message}`)
    return {
      status: 'failed',
      message: `Error when creating in app message: ${e.message}`,
    }
  }
}

export const sendMessages = (type) => {
  /**
   * cronjob call this method periodically
   * it will depend on these settings
   * - messages_enabled: global enable/disable sending
   * - messages_maxRetries: global max retry times
   * @returns Object
   * - { status } String - success or failed
   * - { message } String
   * - { successIds } Array of message id which are sent successfully
   * - { failureIds } Array of message id which are sent faulty
   */
  const successIds = []
  const failureIds = []
  // get the config to decide which type of message is enabled
  const cfgs = getCfgs([
    'messages_enabled',
    'messages_maxRetries',
    'messagesMaxSend',
  ]) || {
    messages_enabled: 'true',
    messages_maxRetries: '10',
    messagesMaxSend: '10',
  }
  // max_message_send only send 10 messages at a time

  // debug({ cfgs })

  const { messages_enabled, messages_maxRetries, messagesMaxSend } = cfgs
  const config = {
    enabled: messages_enabled === 'true', // enable/disable global messages notification
    maxRetries: messages_maxRetries ? parseInt(messages_maxRetries, 10) : 10,
    maxSends: messagesMaxSend ? parseInt(messages_maxRetries, 10) : 10,
  }
  // debug({ config })
  if (config.enabled !== true) {
    return {
      status: 'info',
      message: 'Messages notification setting is disabled',
    }
    // just stop here
  }
  // get all messages need to be sent (status are ready and queued)
  let messages
  if (!type) {
    messages = Messages.find(
      {
        status: { $in: ['ready', 'queued'] },
        $or: [{ nextRun: null }, { nextRun: { $lt: new Date() } }],
      },
      { limit: config.maxSends, sort: { priority: 1 } }
    )
  } else {
    // debug(`filtering to only send ${type}`)
    messages = Messages.find(
      {
        status: { $in: ['ready', 'queued'] },
        type: type,
        $or: [{ nextRun: null }, { nextRun: { $lt: new Date() } }],
      },
      { limit: config.maxSends }
    )
  }

  if (messages.count() === 0) {
    return {
      status: 'info',
      message: 'no message to be sent',
    }
  }

  // try to send them
  messages.map((message) => {
    // debug({ message })
    Transporter.send(message).then((result) => {
      if (result.status === 'success') {
        // update the message mark it sent
        Messages.update(
          { _id: message._id },
          {
            $set: {
              status: 'sent',
              updatedAt: new Date(),
            },
            $push: {
              history: {
                message: 'sent',
                createdAt: new Date(),
              },
            },
          }
        )
      } else {
        // handle the retry times. Accept the value from the transport
        if (message.retries >= config.maxRetries) {
          // logger.audit(
          //   `SMS to ${data.recipient} failed after ${config.maxRetries} retries `,
          //   message
          // )
          Messages.update(
            { _id: message._id },
            {
              $set: {
                status: 'failed',
                updatedAt: new Date(),
              },
              $inc: {
                retries: 1,
              },
              $push: {
                history: {
                  message: result,
                  createdAt: new Date(),
                },
              },
            }
          )
        } else {
          // increase the retries count
          // calculate the nextRun date
          const nextRun = moment()
            .add(message.retries * 2 + 1, 'minutes')
            .toDate()
          Messages.update(
            { _id: message._id },
            {
              $set: {
                status: 'queued',
                nextRun,
                updatedAt: new Date(),
              },
              $inc: {
                retries: 1,
              },
              $push: {
                history: {
                  message: result,
                  createdAt: new Date(),
                },
              },
            }
          )
        }

        // call transport to report sending status? maybe not necessary?
      }
    })
  })

  return {
    status: 'info',
    message: `Sent messages`,
  }
}
