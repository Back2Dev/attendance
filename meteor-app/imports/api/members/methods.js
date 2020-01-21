import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import XLSX from 'xlsx'
import Members, { Dupes, RawDupes } from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'
import { eventLog } from '/imports/api/eventlogs'
import log from '/imports/lib/server/log'
import { saveToArchive } from '/imports/api/archive'

const debug = require('debug')('b2b:server-methods')

const rmFighter = name => {
  const member = Members.findOne({ name })
  const memberId = member._id
  Purchases.remove({ memberId })
  Carts.remove({ memberId })
  Sessions.remove({ memberId })
  const n = Members.remove(memberId)
  if (!n) throw new Meteor.Error(`Could not remove the ${name} :(`)
}
Meteor.methods({
  //
  // These first methods are for testing purposes, to add/delete data
  //
  'members.rmEddie': function(name) {
    try {
      log.info(`Removing member: Eddie Mercx ${name}`)
      return Members.remove({ name: 'Eddie Mercx' })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.mkFakeUser': function(username, member) {
    const m = Members.findOne({ name: username })
    if (!m) {
      member.name = username // Override the name
      member.email = `${username.replace(/ /g, '.')}@${username.replace(/ /g, '-')}s.inc.inc`.toLowerCase()
      const id = Members.insert(member)
      if (!id) throw new Meteor.Error(`Could not add a ${username} :(`)
    }
  },
  'members.rmToughGuy': function() {
    rmFighter('Tough Guy')
  },
  'members.rmJackieChan': function() {
    rmFighter('Jackie Chan')
  },
  'members.rmBruceLee': function() {
    rmFighter('Bruce Lee')
  },
  'members.addDude': function(dude) {
    const memberId = Members.insert(dude.member)
    if (!memberId) debug(`Error creating new dude ${dude.member.name}`)
    else {
      Members.update(memberId, { $set: { sessions: dude.sessions } })
      dude.sessions.forEach(session => {
        session.memberId = memberId
        session.memberName = dude.member.name
        session.createdAt = session.timeIn
        session.updatedAt = session.timeIn
        if (!Sessions.insert(session, { bypassCollection2: true })) debug(`Error inserting session ${session.name}`)
      })
      dude.carts.forEach(cart => {
        cart.memberId = memberId
        if (!Carts.insert(cart, { bypassCollection2: true })) debug(`Error inserting cart`)
      })
      dude.purchases.forEach(purchase => {
        purchase.memberId = memberId
        if (!Purchases.insert(purchase, { bypassCollection2: true })) debug(`Error inserting purchase`)
      })
    }
  },
  'members.addCard': function(name, paymentCustId) {
    try {
      log.info(`Adding card to member: ${name}`)
      return Members.update({ name }, { $set: { paymentCustId } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  //
  // Regular methods from here...
  //
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
      const data = {}
      data.member = Members.findOne(id)
      if (!data.member) throw new Meteor.Error(`Could not find member ${id}`)
      data.purchases = Purchases.find({ memberId: id }).fetch()
      data.carts = Carts.find({ memberId: id }).fetch()
      data.sessions = Sessions.find({ memberId: id }).fetch()
      eventLog({
        who: 'Admin',
        what: `removed member id: ${id}`,
        object: data.member
      })
      saveToArchive('member', data)
      Purchases.remove({ memberId: id })
      Carts.remove({ memberId: id })
      Sessions.remove({ memberId: id })
      return Members.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'members.removeDupe': function(id, merge) {
    const data = { merge }
    data.member = Members.findOne(id)
    if (!data.member) throw new Meteor.Error(`Could not find member ${id}`)
    data.purchases = Purchases.find({ memberId: id }).fetch()
    data.carts = Carts.find({ memberId: id }).fetch()
    data.sessions = Sessions.find({ memberId: id }).fetch()
    eventLog({
      who: 'Admin',
      what: `removed member id: ${id}`,
      object: data.member
    })
    // If merging, find another member with same name for transfer
    if (merge) {
      const members = Members.find({ name: data.member.name, _id: { $ne: id } }, { sort: { sessionCount: -1 } }).fetch()
      if (members.length) {
        const memberId = members[0]._id
        Purchases.update({ memberId: id }, { $set: { memberId } })
        Carts.update({ memberId: id }, { $set: { memberId } })
        Sessions.update({ memberId: id }, { $set: { memberId } })
        const sessions = Sessions.find({ memberId }, { sort: { createdAt: 1 } }).fetch()
        Members.update(memberId, { $set: { sessions, sessionCount: sessions.length } })
      }
    } else {
      Purchases.remove({ memberId: id })
      Carts.remove({ memberId: id })
      Sessions.remove({ memberId: id })
    }
    Dupes.remove(data.member.name) // Kill the duplicate to force a refresh
    saveToArchive('member', data)
    Members.remove(id)
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
    // Reactive performance is a little better by using a second collection
    syncMapReduce(m, r, {
      out: 'rawdupes'
    })

    // Refresh the collection
    Dupes.remove({})
    RawDupes.find({ value: { $gt: 1 } }).forEach(rec => Dupes.insert(rec))
    // const dupes = Dupes.find({ value: { $gt: 1 } }).fetch()
    // debug(dupes)
  },
  'member.email.invoice': function(cartId, email, note, discountedPrice, discount) {
    const cart = Carts.findOne(cartId)
    if (!cart) throw new Meteor.Error(`Could not find shopping cart ${cartId}`)
    const member = Members.findOne(cart.memberId)
    debug('Emailing invoice for cart', cart)
    if (!note)
      note = 'You are receiving this email because you train with Peak Adventure, and would like to make a payment.'

    const priceFormat = price => `${price / 100}.00`

    return Meteor.call(
      'sendInvoiceEmail',
      email,
      {
        // merge fields:
        date: moment().format('DD/MM/YYYY'),
        name: member.name,
        email,
        note,
        discount: priceFormat(discount),
        description1: cart.products[0].name,
        description2: cart.products.length > 1 ? cart.products[1].name : '',
        description3: cart.products.length > 2 ? cart.products[2].name : '',
        amount1: priceFormat(cart.products[0].price),
        amount2: cart.products.length > 1 ? priceFormat(cart.products[1].price) : '',
        amount3: cart.products.length > 2 ? priceFormat(cart.products[2].price) : '',
        subtotal: priceFormat(cart.price),
        gst: priceFormat(0),
        total: priceFormat(discountedPrice),
        terms: 'Payment within 14 days',
        link: `${Meteor.absoluteUrl()}shop/renew/${member._id}/${cartId}`
      },
      Meteor.settings.private.invoiceID
    )
  },

  'slsa.load': function(data, season) {
    const slsaMap = {
      'Member ID': 'slsaId',
      'First Name': 'first',
      'Last Name': 'last',

      Status: 'status',
      Season: 'season',
      'Email Address 1': 'email1',
      'Email Address 2': 'email2',
      'Working with Children Registration Expiry Date': 'wwccExpiry',
      'Working with Children Registration No': 'wwcc'
    }

    let countTotal = 0
    let numRows = 0
    if (Meteor.isClient) return
    try {
      let started = false
      const lines = data
        .split('\n')
        .filter(line => {
          if (line.match(/^Member ID/)) {
            started = true
          }
          return started
        })
        .join('\n')
      debug('Loading SLSA from csv data', lines)
      const parse = XLSX.read(lines, { type: 'string' })
      const wb = parse.Sheets
      const sheets = Object.keys(wb)
      for (const s of sheets) {
        try {
          const wanted = ['Member ID', 'Last Name', 'First Name']
          const rows = XLSX.utils.sheet_to_json(wb[s], {
            raw: true
          })
          numRows = rows.length
          countTotal = rows
            .filter(row => row.Status === 'Active' && row.Season === season)
            .map(row => {
              const newRow = {}
              Object.keys(slsaMap).forEach(key => (newRow[slsaMap[key]] = row[key]))
              newRow.name = `${newRow.first} ${newRow.last}`
              // debug('wwcc', newRow.wwcc, typeof newRow.wwcc)
              // if (newRow.wwcc && typeof newRow.wwcc === 'string') newRow.wwcc = newRow.wwcc.replace(/-.*$/, '')
              return newRow
            })

            .reduce((acc, m) => {
              debug(`Updating ${m.name}`)
              const queries = [{ name: m.name }]
              if (m.email1 && m.email2) {
                queries.push({ $or: [{ email: m.email1 }, { email: m.email2 }] })
              } else {
                if (m.email1) queries.push({ email: m.email1 })
              }
              let member
              let q
              while (!member && (q = queries.pop())) {
                member = Members.findOne(q)
              }
              if (member) {
                Members.find(member._id).map(m => debug(m.name))
                return acc + Members.update(member._id, { $set: { isSlsa: true, wwcc: m.wwcc } })
              } else {
                debug(`Could not find ${m.name}/${m.email1} ${m.email2}`)
                return acc
              }
            }, 0)
          debug('updated', countTotal)
        } catch (e) {
          console.error(`Couldn't update members from csv ${s}: `, e)
        }
      }
      const message = `Updated ${countTotal} of ${numRows} records in file`
      debug(message)
      return message
    } catch (e) {
      debug(e)
      throw new Meteor.Error(500, e)
    }
  },
  'members.forgetCard': function(memberId) {
    debug(`Removing credit card for ${memberId}`)
    const member = Members.findOne(memberId)
    if (!member) throw new Meteor.Error(`Could not find member ${memberId}`)
    else {
      const paymentCustId = { member }
      Members.update(memberId, { $unset: { paymentCustId: 1 } })
      eventLog({
        who: 'Admin',
        what: `Remove credit card for ${member.name} (${memberId})`,
        object: { memberId, paymentCustId }
      })
    }
  },
  'members.updateAutoPay': function(memberId, value) {
    debug(`Setting autopay for ${memberId} to ${value}`)
    const member = Members.findOne(memberId)
    if (!member) throw new Meteor.Error(`Could not find member ${memberId}`)
    else {
      Members.update(memberId, { $set: { autoPay: value } })
      eventLog({
        who: 'Admin',
        what: `Set autoPay: ${value} for ${member.name} (${memberId})`,
        object: { memberId }
      })
    }
  }
})
