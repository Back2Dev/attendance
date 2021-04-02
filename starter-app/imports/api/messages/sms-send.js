const AWS = require('aws-sdk')
import logger from '/imports/lib/log'
import { Meteor } from 'meteor/meteor'

AWS.config.update({
  region: Meteor.settings.private.S3_REGION,
  credentials: {
    accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
    secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  },
})

export const sendSMS = ({ recipient, sender, message }) => {
  try {
    logger.info('Sending sms message...', {
      recipient,
      sender,
      message,
    })
    const params = {
      Message: message,
      PhoneNumber: recipient,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: sender,
        },
      },
      MessageStructure: 'string',
    }

    return new Promise((resolve, reject) => {
      const publish = new AWS.SNS().publish(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          logger.audit('SMS response', data)
          resolve(data)
        }
      })
    })
  } catch (e) {
    return { status: 'failed', message: `Something went wrong sending SMS: ${e.message}` }
  }
}
