import { Meteor } from 'meteor/meteor'
const mandrill = require('mandrill-api/mandrill')
import logger from '/imports/lib/log'

const mandrillClient = new mandrill.Mandrill(Meteor.settings.private.MANDRILL_API_KEY)

export const sendEmail = (message) => {
  return new Promise((resolve, reject) => {
    mandrillClient.messages.send(
      { message: message, async: false, ip_pool: 'Main Pool' },
      function (result) {
        if (!['queued', 'sent'].includes(result[0].status)) {
          console.error('Failed to send email', result[0])
          resolve(result)
        } else {
          logger.info('Sent email', result[0])
          logger.audit('Sent email', message)
          resolve(result)
        }
      },
      function (e) {
        // Mandrill returns the error as an object with name and message keys
        logger.error(`A mandrill error occurred: ${e.name} - ${e.message}`)
        reject(e)
      }
    )
  })
}
