import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { Match } from 'meteor/check'

import { Notifications, NotificationItems } from './schema'
import { push } from './server/helper'

Meteor.methods({
  /**
   * Mark all items is read
   * @returns {Object} result
   * @return {string} result.status - success or failed
   * @return {string} result.message - the message
   */
  NotiMarkAllRead() {
    const { userId } = this
    if (!userId) {
      return {
        status: 'failed',
        message: 'Not logged in user',
      }
    }
    const theNotification = Notifications.findOne({ userId })
    if (!theNotification) {
      logger.info(`No nofitications for user ${userId}`, { userId })
      return { status: 'info', message: 'No notification' }
    }
    // mark all items read
    const n = NotificationItems.update(
      { notificationId: theNotification._id },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      },
      { multi: true }
    )
    logger.info('Successfully set all items to read', { userId })
    return {
      status: n ? 'success' : 'info',
      message: `${n} item${n > 1 ? 's' : ''} marked as read`,
    }
  },
  /**
   * Mark an item is read or unread
   * @param {string} itemId
   * @param {boolean} read - default is true (read)
   * @returns {Object} result
   * @return {string} result.status - success or failed
   * @return {string} result.message - the message
   */
  NotiMarkItemRead({ itemId, read = true }) {
    if (!Match.test(itemId, String)) {
      return { status: 'failed', message: 'invalid itemId' }
    }
    if (!Match.test(read, Boolean)) {
      return { status: 'failed', message: 'invalid read status' }
    }
    const { userId } = this
    if (!userId) {
      return {
        status: 'failed',
        message: 'Not logged in user',
      }
    }
    const theItem = NotificationItems.findOne({ _id: itemId })
    if (!theItem) {
      logger.warn(`Item was not found with id ${itemId}`, { itemId, userId, read })
      return { status: 'failed', message: `Item was not found with id ${itemId}` }
    }
    const theNotification = Notifications.findOne({ _id: theItem.notificationId, userId })
    if (!theNotification) {
      logger.warn('Permission denied', { itemId, userId, read })
      return { status: 'failed', message: 'Permission denied' }
    }
    // perform update
    const n = NotificationItems.update(
      { _id: itemId },
      { $set: { read, readAt: new Date() } }
    )
    logger.info('Updated notification item', { itemId, userId, read })
    return {
      status: n ? 'success' : 'failed',
      message: n ? 'updated' : 'unable to update',
    }
  },
  /**
   * trigger on user check the notification
   * @returns {Object} result
   * @return {string} result.status - can be success or failed
   * @return {string} result.message
   */
  notificationsCheck() {
    const { userId } = this
    if (!userId) {
      return {
        status: 'failed',
        message: 'Not logged in user',
      }
    }
    // update the notification
    try {
      const n = Notifications.update(
        { userId },
        {
          $set: {
            checkedAt: new Date(),
          },
        }
      )

      logger.info('notification has been checked and updated', { userId })
      return {
        status: n ? 'success' : 'failed',
        message: n ? 'updated' : 'unable to update',
      }
    } catch (e) {
      logger.error(`Error when updating notification: ${e.message}`, { userId })
      return {
        status: 'failed',
        message: e.message,
      }
    }
  },

  /**
   * Get recently notifications items
   * @param {string} notificationId
   * @param {Date} after
   * @param {number} limit
   * @param {boolean} firstTimeFetch
   * @returns {[Object]} notification items
   */
  notificationsGetRecently({
    notificationId,
    after = null,
    limit = 10,
    firstTimeFetch = false,
  }) {
    if (!Match.test(notificationId, String)) {
      throw new Meteor.Error('notifications.getRecently.1', 'Invalid notification')
    }
    if (!Match.test(after, Match.Maybe(Date))) {
      throw new Meteor.Error('notifications.getRecently.2', 'Invalid time')
    }
    if (!Match.test(limit, Number)) {
      throw new Meteor.Error('notifications.getRecently.3', 'Invalid limit')
    }

    const { userId } = this
    if (!userId) {
      return []
    }

    // get the notification
    const notification = Notifications.findOne({
      _id: notificationId,
      userId,
    })
    if (!notification) {
      return []
    }

    // get notification items
    const condition = {
      notificationId,
      status: firstTimeFetch ? 1 : { $gt: 0 },
    }
    if (after) {
      condition.createdAt = { $gt: after }
    }

    return NotificationItems.find(condition, {
      fields: {
        notificationId: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        read: 1,
        readAt: 1,
        type: 1,
        message: 1,
        url: 1,
        data: 1,
      },
      sort: {
        createdAt: -1,
      },
      limit,
    }).fetch()
  },

  /**
   * Get more notification items
   * @param {string} notificationId
   * @param {Date} before
   * @param {number} limit
   * @returns {[Object]} notification items
   */
  notificationsGetMore({ notificationId, before, limit = 10 }) {
    if (!Match.test(notificationId, String)) {
      throw new Meteor.Error('notifications.getMore.1', 'Invalid notification')
    }
    if (!Match.test(before, Date)) {
      throw new Meteor.Error('notifications.getMore.2', 'Invalid time')
    }
    if (!Match.test(limit, Number)) {
      throw new Meteor.Error('notifications.getMore.3', 'Invalid limit')
    }

    const { userId } = this
    if (!userId) {
      return []
    }

    // get the notification
    const notification = Notifications.findOne({
      _id: notificationId,
      userId,
    })
    if (!notification) {
      return []
    }

    // get notification items
    const condition = {
      notificationId,
      status: { $gt: 0 },
      createdAt: { $lt: before },
    }

    return NotificationItems.find(condition, {
      fields: {
        notificationId: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        read: 1,
        readAt: 1,
        type: 1,
        message: 1,
        data: 1,
      },
      sort: {
        createdAt: -1,
      },
      limit,
    }).fetch()
  },

  /**
   * Temporary testing only
   * will be removed soon
   */
  notificationsTest({ userId, type, message, url, data }) {
    return push({
      userId: userId || Meteor.userId(),
      type: type || 'test',
      message: message || 'some test message',
      url: url || '',
      data,
    })
  },
})

const methodsRule = [
  { name: 'notificationsCheck', numRequests: 5, timeInterval: 10000 },
  { name: 'notificationsGetRecently', numRequests: 5, timeInterval: 10000 },
  { name: 'notificationsGetMore', numRequests: 5, timeInterval: 10000 },
]

methodsRule.map(({ name, numRequests, timeInterval }) => {
  const ruleObj = {
    type: 'method',
    name,
  }
  DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000)
    return `Please wait ${time} seconds (${name})`
  })
  return DDPRateLimiter.addRule(ruleObj, numRequests, timeInterval)
})
