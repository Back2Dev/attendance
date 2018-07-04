import { Meteor } from 'meteor/meteor'
import Members from '/imports/api/members/members'
import log from '/imports/lib/server/log'
const debug = require('debug')('att:server-methods')

Meteor.methods({
  'members.insert'(member) {
    try {
      return Members.insert(member)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.remove'(id) {
    try {
      log.info('removing member id: ', id)
      return Members.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.setPin'(id, pin) {
    try {
      log.info('setting pin: ', id, pin)
      // return Members.remove({ _id: id })
      return Members.update({ _id: id }, { $set: { pin: pin } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.update'(id, formData) {
    try {
      log.info('updating member: ', id, formData)
      return Members.update({ _id: id }, { $set: { ...formData } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  
  'members.forgotPin'(id, method, destination) {
    log.info(`sending pin for member ${id} via ${method} to ${destination}`)
    try {
      // make DB query and grab the pin.
      const member = Members.findOne(id)
      const pin = member.pin
      // construct message.
      const message = 'Your PIN for Back2Bikes attendance app is: \n ' + pin
      if (method == 'email') {
        debug('sending PIN reminder via email.', destination, message)
        return Meteor.call('sendEmail', destination, message, 'Back2Bikes Pin Reminder')
      } else {
        // Meteor.call(send sms, message, destination)
        debug('sending via sms.', message)
      }
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.changeAvatar'(id, avatar) {
    try {
      debug('changing avatar: ', id, avatar)
      // return Members.remove({ _id: id })
      // return Members.update({ _id: id }, { $set: { pin: pin } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})