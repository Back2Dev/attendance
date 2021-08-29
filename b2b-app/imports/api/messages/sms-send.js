const AWS = require('aws-sdk')
import logger from '/imports/lib/log'
import axios from 'axios'
import { Meteor } from 'meteor/meteor'
import Settings from '/imports/api/settings/schema'
const debug = require('debug')('app:sms-send')

const smsSettings = { enabled: false }

const required = ['USERNAME', 'PASSWORD', 'FROM', 'URL']

if (Meteor.settings.private && Meteor.settings.private.SMS) {
  const settings = Meteor.settings.private.SMS
  smsSettings.enabled = required.every((item) => {
    smsSettings[item] = settings[item]
    if (!settings[item]) {
      logger.info(`SMS settings are missing SMS.${item}`)
    }
    return settings[item]
  })
}
logger.info('SMS Sending is ' + smsSettings.enabled)

AWS.config.update({
  region: Meteor.settings.private.S3_REGION,
  credentials: {
    accessKeyId: Meteor.settings.private.S3_ACCESS_KEY_ID,
    secretAccessKey: Meteor.settings.private.S3_SECRET_ACCESS_KEY,
  },
})

export const sendSMSViaSMSBroadcast = async ({ recipient, sender, message }) => {
  try {
    const body = {
      username: smsSettings.USERNAME,
      password: smsSettings.PASSWORD,
      from: smsSettings.FROM,
      to: recipient,
      message: message,
    }
    let url = smsSettings.URL
    Object.keys(body).forEach((item, ix) => {
      const joiner = ix === 0 ? '?' : '&'
      url = `${url}${joiner}${item}=${body[item]}`
    })
    debug('url=' + url)
    const { status } = await axios.get(url)
    if (status === 200) {
      logger.info(`sent SMS to ${recipient}`)
    } else {
      logger.error(`Failed to send sms status code ${status}`)
    }
  } catch (e) {
    logger.error(`Failed to send sms: ${e.message}`, { recipient, sender, message })
    return { status: 'failed', message: `Something went wrong sending SMS: ${e.message}` }
  }
}

export const sendSMSviaAWS = ({ recipient, sender, message }) => {
  try {
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
          logger.info('SMS response', data)
          resolve(data)
        }
      })
    })
  } catch (e) {
    logger.audit(`Failed to send sms: ${e}`, { recipient, sender, message })
    return { status: 'failed', message: `Something went wrong sending SMS: ${e.message}` }
  }
}

export const sendSMS = ({ recipient, sender, message }) => {
  const service = Settings.findOne({ key: 'sms-service' })?.value
  if (!service)
    logger.error(
      'Could not find settings for sms service. Please add one or reload settings fixtures'
    )

  switch (service) {
    case 'smsbroadcast':
      return sendSMSViaSMSBroadcast({ recipient, sender, message })
    case 'sns':
      return sendSMSviaAWS({ recipient, sender, message })
    default:
      logger.error('Incorrect sms service setting. please check again')
      break
  }
}
