import { Match } from 'meteor/check'
import { Notifications, NotificationItems } from '../schema'

/**
 * Push notification
 * @param {string} userId
 * @param {string} type - notification type, use to handle some special actions on front end
 * @param {string} message - message to be displayed
 * @param {string} url - the optional page user will be sent to when click on item
 * @param {Object} data - the optional data object. You can store anything here but only some of theme which matters
 * @param {Object} data.user - the sender (optional)
 * @param {string} data.user.avatar - the sender's avatar will be displayed (optional)
 * @param {string} data.user.name - the sender's name (optional)
 * @returns {Object} result
 * @returns {string} result.status - failed or success
 * @returns {string} result.message
 * @returns {string} result.notificationId - id from Notifications
 * @returns {string} result.itemId - id from NotificationItems
 */
export const push = ({ userId, type = 'default', message, url, data }) => {
  if (!Match.test(userId, String)) {
    return {
      status: 'failed',
      message: 'invalid userId',
    }
  }
  if (!Match.test(type, String)) {
    return {
      status: 'failed',
      message: 'invalid type',
    }
  }
  if (!Match.test(message, String)) {
    return {
      status: 'failed',
      message: 'invalid message',
    }
  }
  if (!Match.test(url, Match.Maybe(String))) {
    return {
      status: 'failed',
      message: 'invalid url',
    }
  }

  // find this user's notification
  let notificationId
  const notification = Notifications.findOne({ userId })
  if (!notification) {
    notificationId = Notifications.insert({
      userId,
    })
  } else {
    notificationId = notification._id
  }

  if (!notificationId) {
    return {
      status: 'failed',
      message: 'Unable to find notification id',
    }
  }

  // handle too many chat notification
  if (type === 'chat') {
    // group all items since the last time user checked.
    if (notification && notification.checked) {
      NotificationItems.update(
        {
          notificationId,
          type,
          'data.conversationId': data?.conversationId,
          status: 1,
          createdAt: { $gt: notification.checked },
        },
        {
          $set: { status: 2, updatedAt: new Date() },
        }
      )
    }
  }

  // insert to items
  const itemId = NotificationItems.insert({
    notificationId,
    type,
    message,
    url,
    data,
    status: 1,
    createdAt: new Date(),
  })
  if (!itemId) {
    return {
      status: 'failed',
      message: 'Unable to insert notification item',
    }
  }

  // update the notification
  Notifications.update(
    { _id: notificationId },
    {
      $set: { updatedAt: new Date() },
    }
  )

  return {
    status: 'success',
    message: 'done',
    notificationId,
    itemId,
  }
}
