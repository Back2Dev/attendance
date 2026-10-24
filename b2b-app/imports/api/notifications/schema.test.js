// schema.test.js

/* eslint-disable no-unused-expressions */

// import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Notifications.insertAsync(good)
        const thing = await Notifications.findOneAsync(id)
        const fields = ['userId'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  describe('query database bad items', () => {
    badNotifications.forEach((bad, i) => {
      it(`Succeeds on BAD items insert ${i + 1}`, async () => {
        await expect(Notifications.insertAsync(bad)).to.be.rejected
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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await NotificationItems.insertAsync(good)
        const thing = await NotificationItems.findOneAsync(id)
        const fields = ['notificationId', 'type', 'message'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  describe('query database bad items', () => {
    badNotificationsItems.forEach((bad, i) => {
      it(`Succeeds on BAD items insert ${i + 1}`, async () => {
        await expect(NotificationItems.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
