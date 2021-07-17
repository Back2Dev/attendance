import { Meteor } from 'meteor/meteor'
import axios from 'axios'
import logger from '/imports/lib/log'

export const sendEmail = async (message) => {
  let body = {
    message,
    key: Meteor.settings.private.MANDRILL_API_KEY,
  }

  try {
    const { status, data } = await axios.post(
      'https://mandrillapp.com/api/1.0/messages/send',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (status !== 200) return { status: 'failed', message: data[0].message }

    if (!data.length)
      return { status: 'failed', message: 'Missing data info from response' }
    return data[0]
  } catch (error) {
    logger.error('Failed to send email')
    return { status: 'failed', message: error.message }
  }
}
