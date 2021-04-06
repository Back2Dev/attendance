import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'

import { getCfg } from '/imports/api/settings/server/helper.js'
import Members from '/imports/api/members/schema'
import { getUserEmailAddress } from '/imports/api/users/utils.js'
// import { push } from '/imports/api/notifications/server/helper.js'

Meteor.methods({
  /**
   *
   * @param {string} subject
   * @param {string} message
   * @returns {Object} result
   * - {string} result.status - success or failed
   * - {string} result.message
   */
  'support.create'({ subject, message }) {
    if (!Match.test(subject, String)) {
      return { status: 'failed', message: 'invalid subject' }
    }
    if (!Match.test(message, String)) {
      return { status: 'failed', message: 'invalid message' }
    }

    const { userId } = this
    if (!userId) {
      return { status: 'failed', message: 'Please login' }
    }

    const user = Meteor.users.findOne(userId)
    const member = Members.findOne({ userId })
    if (!user || !member) {
      return { status: 'failed', message: 'Please login and complete your user member' }
    }

    const toEmail = getCfg('support_email', 'support@mydomain.com.au')
    const fromEmail = getUserEmailAddress(user)
    const theSubject = `Support message from ${member.name || fromEmail}`
    const theMessage = `
      <p>Subject: ${subject}</p>
      <p>Message: ${message}</p>
      <p>
        User Info:<br />
        user ID: ${user._id}<br />
        Name: ${member.name || 'N/A'}<br />
        Email: ${fromEmail}<br />
        Phone Number: ${member.mobile || 'N/A'}
      </p>
    `
    const form = {
      type: 'email',
      to: toEmail,
      subject: theSubject,
      body: theMessage,
      data: {
        html: theMessage,
        subject: theSubject,
        to: [
          {
            email: toEmail,
            name: 'Support Team',
          },
        ],
        headers: {
          'Reply-To': fromEmail,
        },
      },
    }

    const result = Meteor.call('insert.messages', form)
    if (result.status === 'failed') {
      return { status: 'failed', message: 'Unable to send message' }
    }

    return {
      status: 'success',
      message: '',
    }
  },
})
