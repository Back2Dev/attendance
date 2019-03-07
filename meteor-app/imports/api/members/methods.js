import { Meteor } from 'meteor/meteor'
import Members, { Dupes } from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

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
      log.info('Setting pin: ', id, pin)
      return Members.update({ _id: id }, { $set: { pin: pin } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.rmPin'(name) {
    try {
      log.info('Removing pin: ', name)
      return Members.update({ name }, { $unset: { pin: true } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.rmEddie'(name) {
    try {
      log.info('Removing member: Eddie Mercx ' + name)
      return Members.remove({ name: 'Eddie Mercx' })
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
        return Meteor.call('sendPINEmail', destination, message, 'Back2Bikes Pin Reminder')
      } else {
        Meteor.call('sendPINSms', message, destination)
        debug('sending PIN via sms.', message)
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
  },
  'members.showDupes2'() {
    const m = function() {
      emit(this.name, 1)
    }
    const r = function(k, vals) {
      return Array.sum(vals)
    }
    var result = Members.mapReduce(m, r, { out: { inline: 1 } })
    console.log(result.filter(row => row.value > 1))
  },
  /* Duplicate member detection, started with this script, 
   Which runs in the mongo shell
m = function () {
  emit(this.name, 1);
}
r = function (k, vals) {
  return Array.sum(vals);
}

res = db.members.mapReduce(m,r, { out : "duplicates" });
db[res.result].find({value: {$gt: 1}});
*/
  'members.showDupes'() {
    const m = function() {
      emit(this.name, 1)
    }
    const r = function(k, vals) {
      return Array.sum(vals)
    }

    // convert mapReduce to synchronous function
    const rawMembers = Members.rawCollection()
    var syncMapReduce = Meteor.wrapAsync(rawMembers.mapReduce, rawMembers)

    // CollectionName will be overwritten after each mapReduce call
    syncMapReduce(m, r, {
      out: 'dupes'
    })

    const dupes = Dupes.find({ value: { $gt: 1 } }).fetch()
    console.log(dupes)
  }
})
