// schema.test.js

/* eslint-disable no-unused-expressions */

// import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import { Notifications, NotificationItems } from './schema'
// import Factory from '/imports/test/factories'
// import '/imports/test/factory.messages'

const badNotifications = [
  // no userId
  // {},
]

const goodNotifications = [
  {
    userId: 'MHFXrqLKdEttpuHpH',
  },
]

describe('Notifications Schema', () => {
  describe('query database good items', () => {
    goodNotifications.forEach((good, i) => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Notifications.insert(good)
        const thing = Notifications.findOne(id)
        const fields = ['userId'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  describe('query database bad items', () => {
    badNotifications.forEach((bad, i) => {
      it(`Succeeds on BAD items insert ${i + 1}`, () => {
        expect(() => Notifications.insert(bad)).to.throw()
      })
    })
  })
})

const badNotificationsItems = [
  // no type
  {},
]

const goodNotificationsItems = [
  {
    notificationId: 'MHFXrqLKdEttpuHpH',
    type: 'some-type',
    message: 'some message',
  },
]

describe('NotificationsItems Schema', () => {
  describe('query database good items', () => {
    goodNotificationsItems.forEach((good, i) => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = NotificationItems.insert(good)
        const thing = NotificationItems.findOne(id)
        const fields = ['notificationId', 'type', 'message'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  describe('query database bad items', () => {
    badNotificationsItems.forEach((bad, i) => {
      it(`Succeeds on BAD items insert ${i + 1}`, () => {
        expect(() => NotificationItems.insert(bad)).to.throw()
      })
    })
  })
})
