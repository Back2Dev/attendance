import { Meteor } from 'meteor/meteor'
import Members, { Dupes } from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  'members.insert': function(member) {
    try {
      return Members.insert(member)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.remove': function(id) {
    try {
      log.info('removing member id: ', id)
      return Members.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.setPin': function(id, pin) {
    try {
      log.info('Setting pin: ', id, pin)
      return Members.update({ _id: id }, { $set: { pin } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.rmPin': function(name) {
    try {
      log.info('Removing pin: ', name)
      return Members.update({ name }, { $unset: { pin: true } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.rmEddie': function(name) {
    try {
      log.info(`Removing member: Eddie Mercx ${name}`)
      return Members.remove({ name: 'Eddie Mercx' })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.update': function(id, formData) {
    try {
      log.info('updating member: ', id, formData)
      return Members.update({ _id: id }, { $set: { ...formData } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  'members.forgotPin': function(id, method, to, remember) {
    log.info(`sending pin for member ${id} via ${method} to ${to} ${remember}`)
    try {
      // make DB query and grab the pin.
      const member = Members.findOne(id)
      const pin = member.pin
      // construct message.
      let message = `
You are receiving this email because you requested a PIN reminder 
from ${Meteor.settings.public.org}.

Your PIN for the ${Meteor.settings.public.org} sign in app is: ${pin}

If you did not request the forgotten PIN, or you have privacy concerns, 
please forward this email to ${Meteor.settings.public.support}, 
and explain your concerns. If you can please include your phone number, 
so we can contact you to discuss them and make sure they are dealt 
with to your satisfaction.

Regards

The support team

${Meteor.settings.public.org}
`
      if (method == 'email') {
        debug('sending PIN reminder via email ', to)
        if (!member.email && remember) Members.update(member._id, { $set: { email: to } })
        return Meteor.call('sendPINEmail', to, pin, message, `${Meteor.settings.public.org} Pin Reminder`)
      } else {
        message = `Your PIN for the ${Meteor.settings.public.org} sign in app is: ${pin}`
        Meteor.call('sendPINSms', message, to)
        debug('sending PIN via sms.', message)
        if (!member.mobile && remember) Members.update(member._id, { $set: { mobile: to } })
      }
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.showDupes2': function() {
    const m = function() {
      emit(this.name, 1)
    }
    const r = function(k, vals) {
      return Array.sum(vals)
    }
    const result = Members.mapReduce(m, r, { out: { inline: 1 } })
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
  'members.showDupes': function() {
    const m = function() {
      emit(this.name, 1)
    }
    const r = function(k, vals) {
      return Array.sum(vals)
    }

    // convert mapReduce to synchronous function
    const rawMembers = Members.rawCollection()
    const syncMapReduce = Meteor.wrapAsync(rawMembers.mapReduce, rawMembers)

    // CollectionName will be overwritten after each mapReduce call
    syncMapReduce(m, r, {
      out: 'dupes'
    })

    const dupes = Dupes.find({ value: { $gt: 1 } }).fetch()
    console.log(dupes)
  }
})
