//  methods.js
import CONSTANTS from '/imports/api/constants'
import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
//
// Importing the data api's makes  sure collections are set up properly.
//
import MessageTemplates from '/imports/api/message-templates/schema'
import { sendMessages } from '/imports/api/messages/functions'
import log, { createLog } from '/imports/lib/log'
import { push } from '/imports/api/notifications/server/helper.js'
import { convertMergeTags, convertLink } from '/imports/api/util.js'
import Triggers from '/imports/api/triggers/schema'
import moment from 'moment'
import HTMLTemplate from '/imports/api/email-template'

const debug = require('debug')('app:methods')

const _ = require('lodash')

/**
 * Utility function to throw a meteor error (and also echo it to the console).
 *
 * @param {string} msg - The message to go with the exception.
 */
export const myThrow = function (msg) {
  console.error(`Throwing error: ${msg}`)
  throw new Meteor.Error(msg)
}

const checkAdmin = function () {
  return true
}
const searchStr = function (name) {
  const fixed = _.deburr(name.replace(/[\-\'\"\s]/g, '.'))
  return new RegExp(fixed, 'i')
}

Meteor.methods({
  showUser(email) {
    createLog({
      type: CONSTANTS.LOG_EVENT_TYPES.METHOD_CALL,
      data: {
        method: 'showUser',
        email,
      },
    })
    const user = Accounts.findUserByEmail(email)
    if (!user) {
      debug(`User not found with email ${email}`)
    } else {
      debug('user: ', user)
    }
  },

  rmUser(username) {
    if (Meteor.isClient) return
    new SimpleSchema({
      username: { type: String },
    }).validate({ username })

    try {
      Meteor.users.remove({ username })
      createLog({
        type: CONSTANTS.LOG_EVENT_TYPES.USER_DELETE,
        data: {
          username,
        },
      })
    } catch (e) {
      log.error('Error removing user', e)
      throw new Meteor.Error(e.message)
    }
  },
  testLog() {
    log.error('Something went wrong', { name: 'Blamed me' })
  },
  testAudit() {
    log.audit('This is an audit entry, should go to both logs and audit trail', {
      name: 'Audited me',
    })
  },
  sendTrigger: ({
    user,
    member,
    people = [],
    slug = CONSTANTS.UNKNOWN_TRIGGER,
    emailLink,
    emailMessage,
  }) => {
    try {
      const trigger =
        Triggers.findOne({ slug }) ||
        Triggers.findOne({ slug: CONSTANTS.UNKNOWN_TRIGGER })
      if (!trigger) {
        log.error(`Could not find trigger ${slug}`)
        return null
      }
      // 'user' is the user doing the action
      // if user is already in 'people' array
      if (people.some((roleObj) => roleObj._id === user._id)) {
        people.forEach((person) => {
          if (person._id === user._id) {
            // override all other roles
            person.roles = [{ _id: 'USR' }]
          }
        })
      } else {
        user.name = member?.name
        user.mobile = member?.mobile
        user.avatar = member?.avatar
        user.roles = [{ _id: 'USR' }]
        people.push(user)
      }
      const { notifications } = trigger
      notifications.forEach((notification) => {
        // Find the corresponding template (recipients are in the notification)
        const template = MessageTemplates.findOne({ slug: notification.text })
        if (!template)
          throw new Meteor.Error(`Could not find message template: ${notification.text}`)
        let body
        let form
        let url
        let filteredPeople = people.filter((person) => {
          return person.roles.some((roleObj) => {
            return notification.recipients.includes(roleObj._id)
          })
        })
        // Check if the notification is APP, EMAIL or SMS
        switch (template.type) {
          case 'APP':
            // The filtered people are now the recipients of the current notification
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: notification.userInfo ? user?.name : recipient?.name,
                address: 'Address',
                type: 'Transaction type',
                // this only works for 1 role (when signing up)
                userName: user.name || 'User',
                role:
                  user.roles[0]._id === 'USR'
                    ? 'Customer'
                    : CONSTANTS.ROLES[user.roles[0]._id],
                email: user.emails[0].address || 'Email',
              })

              url = null

              push({
                userId: recipient._id,
                message: body,
                data: {
                  user: {
                    avatar: notification.userInfo ? user.avatar : recipient.avatar,
                    name: recipient.name,
                  },
                },
                url,
              })
            })
            break
          case 'EMAIL':
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: recipient?.name || 'User',
                address: 'Address',
                type: 'Type',
                // this role and email only works for new signups (1 role)
                // defaults to Customer if role is USR
                name: user?.name || 'User',
                role:
                  user.roles[0]._id === 'USR'
                    ? 'Customer'
                    : CONSTANTS.ROLES[user.roles[0]._id],
                email: user?.emails[0]?.address || 'Email',
                timestamp: moment().format('DD/MM/YY hh:mm'),
                url: emailLink ? emailLink : '',
                message: emailMessage ? emailMessage : '',
              })
              // Create the form
              form = {
                type: 'email',
                to: recipient.emails[0].address,
                subject: template.subject,
                body: HTMLTemplate.replace('{{contents}}', body).replace(
                  '*|subject|*',
                  template.subject || ''
                ),
                data: {
                  html: HTMLTemplate.replace('{{contents}}', body).replace(
                    '*|subject|*',
                    template.subject || ''
                  ),
                  subject: template.subject,
                  from_email: 'do-not-reply@mydomain.com.au',
                  from_name: 'Startup Inc',
                  to: [
                    {
                      email: recipient.emails[0].address,
                      name: recipient?.name || 'User',
                    },
                  ],
                  headers: {
                    'Reply-To': 'do-not-reply@mydomain.com.au',
                  },
                  important: true,
                  // bcc_address: 'do-not-reply@mydomain.com.au',
                  tags: [trigger.slug],
                  recipient_metadata: [
                    { rcpt: 'do-not-reply@mydomain.com.au', values: { some: 'value' } },
                  ],
                },
              }

              // Send the form
              Meteor.call('insert.messages', form)
            })
            break
          case 'SMS':
            filteredPeople.forEach((recipient) => {
              body = convertMergeTags(template.body, {
                nickname: recipient?.name || 'User',
                address: 'Address',
                type: 'Type',
              })

              // Create the form
              form = {
                type: 'sms',
                to: recipient.mobile,
                subject: 'message from Mydomain',
                body: body,
                data: {
                  recipient: recipient.mobile,
                  sender: 'Mydomain',
                  message: body,
                },
              }

              // Send the form
              Meteor.call('insert.messages', form)
            })
            break
          default:
            throw new Meteor.Error('An error has occurred')
        }
      })
    } catch (e) {
      // Log the error, but don't rethrow it
      log.error(`Error in sendTrigger: ${e.message}`)
    }
  },
  sendAllMessages() {
    sendMessages('webhook')
    sendMessages('sms')
    sendMessages('email')
  },
})
