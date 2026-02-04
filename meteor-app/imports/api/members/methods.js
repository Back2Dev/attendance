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
const fs = require('fs')

const rmFighter = async (name) => {
  const member = await Members.findOneAsync({ name })
  if (!member) debug(`Could not find member ${name}`)
  else {
    const memberId = member._id
    await Purchases.removeAsync({ memberId })
    await Carts.removeAsync({ memberId })
    await Sessions.removeAsync({ memberId })
    const n = await Members.removeAsync(memberId)
    if (!n) throw new Meteor.Error(`Could not remove the ${name} :(`)
  }
}
Meteor.methods({
  //
  // These first methods are for testing purposes, to add/delete data
  //
  'members.mkFakeUser': async function (username, member) {
    const m = await Members.findOneAsync({ name: username })
    if (!m) {
      member.name = username // Override the name
      member.email = `${username.replace(
        / /g,
        '.'
      )}@${username.replace(/ /g, '-')}s.inc.inc`.toLowerCase()
      const id = await Members.insertAsync(member)
      if (!id)
        throw new Meteor.Error(`Could not add a ${username} :(`)
    }
  },
  'members.rmToughGuy': async function () {
    await rmFighter('Tough Guy')
  },
  'members.rmEddie': async function () {
    await rmFighter('Eddie Mercx')
  },
  'members.rmJackieChan': async function () {
    await rmFighter('Jackie Chan')
  },
  'members.rmBruceLee': async function () {
    await rmFighter('Bruce Lee')
  },
  'members.rmCathrineKing': async function () {
    await rmFighter('Cathrine King')
  },
  'members.rmRookiePaddler': async function () {
    await rmFighter('Rookie Paddler')
  },
  'members.addDude': async function (dude) {
    const memberId = await Members.insertAsync(dude.member)
    if (!memberId)
      debug(`Error creating new dude ${dude.member.name}`)
    else {
      await Members.updateAsync(memberId, { $set: { sessions: dude.sessions } })
      for (const session of dude.sessions) {
        session.memberId = memberId
        session.memberName = dude.member.name
        session.createdAt = session.timeIn
        session.updatedAt = session.timeIn
        if (!(await Sessions.insertAsync(session, { bypassCollection2: true })))
          debug(`Error inserting session ${session.name}`)
      }
      for (const cart of dude.carts) {
        cart.memberId = memberId
        if (!(await Carts.insertAsync(cart, { bypassCollection2: true })))
          debug(`Error inserting cart`)
      }
      for (const purchase of dude.purchases) {
        purchase.memberId = memberId
        if (!(await Purchases.insertAsync(purchase, { bypassCollection2: true })))
          debug(`Error inserting purchase`)
      }
    }
  },
  'members.addCard': async function (name, paymentCustId) {
    try {
      log.info(`Adding card to member: ${name}`)
      return await Members.updateAsync({ name }, { $set: { paymentCustId } })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  //
  // Regular methods from here...
  //
  'members.insert': async function (member) {
    try {
      return await Members.insertAsync(member)
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.remove': async function (id) {
    try {
      log.info('removing member id: ', id)
      const data = {}
      data.member = await Members.findOneAsync(id)
      if (!data.member)
        throw new Meteor.Error(`Could not find member ${id}`)
      data.purchases = await Purchases.find({ memberId: id }).fetchAsync()
      data.carts = await Carts.find({ memberId: id }).fetchAsync()
      data.sessions = await Sessions.find({ memberId: id }).fetchAsync()
      eventLog({
        who: 'Admin',
        what: `removed member id: ${id}`,
        object: data.member,
      })
      saveToArchive('member', data)
      await Purchases.removeAsync({ memberId: id })
      await Carts.removeAsync({ memberId: id })
      await Sessions.removeAsync({ memberId: id })
      return await Members.removeAsync({ _id: id })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.removeDupe': async function (id, merge) {
    const data = { merge }
    data.member = await Members.findOneAsync(id)
    if (!data.member)
      throw new Meteor.Error(`Could not find member ${id}`)
    data.purchases = await Purchases.find({ memberId: id }).fetchAsync()
    data.carts = await Carts.find({ memberId: id }).fetchAsync()
    data.sessions = await Sessions.find({ memberId: id }).fetchAsync()
    eventLog({
      who: 'Admin',
      what: `removed member id: ${id}`,
      object: data.member,
    })
    // If merging, find another member with same name for transfer
    if (merge) {
      const members = await Members.find(
        { name: data.member.name, _id: { $ne: id } },
        { sort: { sessionCount: -1 } }
      ).fetchAsync()
      if (members.length) {
        const memberId = members[0]._id
        await Purchases.updateAsync({ memberId: id }, { $set: { memberId } })
        await Carts.updateAsync({ memberId: id }, { $set: { memberId } })
        await Sessions.updateAsync({ memberId: id }, { $set: { memberId } })
        const sessions = await Sessions.find(
          { memberId },
          { sort: { createdAt: 1 } }
        ).fetchAsync()
        await Members.updateAsync(memberId, {
          $set: { sessions, sessionCount: sessions.length },
        })
      }
    } else {
      await Purchases.removeAsync({ memberId: id })
      await Carts.removeAsync({ memberId: id })
      await Sessions.removeAsync({ memberId: id })
    }
    await Dupes.removeAsync(data.member.name) // Kill the duplicate to force a refresh
    saveToArchive('member', data)
    await Members.removeAsync(id)
  },
  'members.setPin': async function (id, pin) {
    try {
      log.info('Setting pin: ', id, pin)
      return await Members.updateAsync({ _id: id }, { $set: { pin } })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.rmPin': async function (name) {
    try {
      log.info('Removing pin: ', name)
      return await Members.updateAsync({ name }, { $unset: { pin: true } })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.userid.update': async function (id, formData) {
    try {
      log.info('updating member: ', id)
      await Members.updateAsync({ _id: id }, { $set: { ...formData } })
      return 'success'
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.update': async function (id, formData) {
    try {
      log.info('updating member: ', id)
      return await Members.updateAsync({ _id: id }, { $set: { ...formData } })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  'members.forgotPin': async function (id, method, to, remember) {
    log.info(
      `sending pin for member ${id} via ${method} to ${to} ${remember}`
    )
    try {
      // make DB query and grab the pin.
      const member = await Members.findOneAsync(id)
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
        if (!member.email && remember)
          await Members.updateAsync(member._id, { $set: { email: to } })
        return await Meteor.callAsync(
          'sendPINEmail',
          to,
          pin,
          message,
          `${Meteor.settings.public.org} Pin Reminder`
        )
      } else {
        message = `Your PIN for the ${Meteor.settings.public.org} sign in app is: ${pin}`
        await Meteor.callAsync('sendPINSms', message, to)
        debug('sending PIN via sms.', message)
        if (!member.mobile && remember)
          await Members.updateAsync(member._id, { $set: { mobile: to } })
      }
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
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
  'members.showDupes': async function () {
    const m = function () {
      emit(this.name, 1)
    }
    const r = function (k, vals) {
      return Array.sum(vals)
    }

    // convert mapReduce to synchronous function
    const rawMembers = Members.rawCollection()
    const syncMapReduce = Meteor.wrapAsync(
      rawMembers.mapReduce,
      rawMembers
    )

    // CollectionName will be overwritten after each mapReduce call
    // Reactive performance is a little better by using a second collection
    await syncMapReduce(m, r, {
      out: 'rawdupes',
    })

    // Refresh the collection
    await Dupes.removeAsync({})
    for (const rec of await RawDupes.find({ value: { $gt: 1 } }).fetchAsync()) {
      await Dupes.insertAsync(rec)
    }
    // const dupes = Dupes.find({ value: { $gt: 1 } }).fetch()
    // debug(dupes)
  },
  'member.email.invoice': async function (
    cartId,
    email,
    note,
    discountedPrice,
    discount
  ) {
    const cart = await Carts.findOneAsync(cartId)
    if (!cart)
      throw new Meteor.Error(`Could not find shopping cart ${cartId}`)
    const member = await Members.findOneAsync(cart.memberId)
    debug('Emailing invoice for cart', cart)
    if (!note)
      note =
        'You are receiving this email because you train with Sandridge, and would like to make a payment.'

    const priceFormat = (price) => `${price / 100}.00`

    return await Meteor.callAsync(
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
        description2:
          cart.products.length > 1 ? cart.products[1].name : '',
        description3:
          cart.products.length > 2 ? cart.products[2].name : '',
        amount1: priceFormat(cart.products[0].price),
        amount2:
          cart.products.length > 1
            ? priceFormat(cart.products[1].price)
            : '',
        amount3:
          cart.products.length > 2
            ? priceFormat(cart.products[2].price)
            : '',
        subtotal: priceFormat(cart.price),
        gst: priceFormat(0),
        total: priceFormat(discountedPrice),
        terms: 'Payment within 14 days',
        link: `${Meteor.absoluteUrl()}shop/renew/${
          member._id
        }/${cartId}`,
      },
      Meteor.settings.private.invoiceID
    )
  },

  'slsa.load': async function (data, season) {
    const autocreate = true
    const slsaMap = {
      'Member ID': 'slsaId',
      'First Name': 'first',
      'Last Name': 'last',

      Status: 'status',
      Season: 'season',
      'Email Address 1': 'email1',
      'Email Address 2': 'email2',
      // 'Working with Children Registration Expiry Date': 'wwccExpiry',
      'Working with Children Registration No': 'wwcc',
    }

    let totals = { added: 0, updated: 0 }
    let numRows = 0
    if (Meteor.isClient) return
    try {
      let started = false
      const lines = data
        .split('\n')
        .filter((line) => {
          if (line.match(/Member ID/)) {
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
            raw: true,
          })
          numRows = rows.length
          totals = { updated: 0, added: 0 }
          const filtered = rows.filter(
            (row) => row.Status === 'Active' && row.Season === season
          )
          for (const [ix, row] of filtered.entries()) {
            const newRow = {}
            Object.keys(slsaMap).forEach((key) => {
              if (row[key]) newRow[slsaMap[key]] = row[key]
            })
            const expiry =
              row['Working with Children Registration Expiry Date']
            newRow.name = `${newRow.first} ${newRow.last}`
            newRow.email = newRow.email1 || newRow.email2
            newRow.wwccSurname = newRow.last
            isSlsa = true

            debug(`Checking ${ix} ${newRow.name}`)
            const queries = [{ name: newRow.name }]
            // Don't check emails, as there can be duplicates
            // if (newRow.email1 && newRow.email2) {
            //   queries.push({
            //     $or: [{ email: newRow.email1 }, { email: newRow.email2 }],
            //   })
            // } else {
            //   if (newRow.email1) queries.push({ email: newRow.email1 })
            // }
            let member
            let q
            while (!member && (q = queries.pop())) {
              member = await Members.findOneAsync(q)
            }
            if (member) {
              totals.updated =
                totals.updated +
                (await Members.updateAsync(member._id, {
                  $set: { isSlsa: true, wwcc: newRow.wwcc },
                }))
            } else {
              if (autocreate) {
                try {
                  await Members.insertAsync(newRow)
                  totals.added = totals.added + 1
                } catch (e) {
                  debug(
                    `Failed to insert member ${newRow.name}: ${e.message}`
                  )
                }
              } else {
                debug(
                  `Could not find ${newRow.name}/${newRow.email1} ${newRow.email2}`
                )
              }
            }
          }
          debug(`Updated ${totals.updated}, added ${totals.added}`)
        } catch (e) {
          console.error(`Couldn't update members from csv ${s}: `, e)
        }
      }
      const message = `Added  ${totals.added}, updated ${totals.updated} of ${numRows} records in file`
      debug(message)
      return message
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'members.forgetCard': async function (memberId) {
    debug(`Removing credit card for ${memberId}`)
    const member = await Members.findOneAsync(memberId)
    if (!member)
      throw new Meteor.Error(`Could not find member ${memberId}`)
    else {
      const paymentCustId = { member }
      await Members.updateAsync(memberId, { $unset: { paymentCustId: 1 } })
      eventLog({
        who: 'Admin',
        what: `Remove credit card for ${member.name} (${memberId})`,
        object: { memberId, paymentCustId },
      })
    }
  },
  'members.updateAutoPay': async function (memberId, value) {
    debug(`Setting autopay for ${memberId} to ${value}`)
    const member = await Members.findOneAsync(memberId)
    if (!member)
      throw new Meteor.Error(`Could not find member ${memberId}`)
    else {
      await Members.updateAsync(memberId, { $set: { autoPay: value } })
      eventLog({
        who: 'Admin',
        what: `Set autoPay: ${value} for ${member.name} (${memberId})`,
        object: { memberId },
      })
    }
  },
  'members.extract': async function (memberId, newName, filename) {
    if (memberId && newName) {
      const prefix = `const ISODate = date => date
      const NumberInt = n => n
      
      const dude = `
      const postfix = `
      export default dude
      `
      const bucket = {}
      const member = await Members.findOneAsync(memberId)
      if (!member.email) member.email = 'nobody@none.such'
      if (!member)
        throw new Meteor.Error(`Could not find member ${memberId}`)
      bucket.member = member
      bucket.sessions = await Sessions.find({ memberId }).fetchAsync()
      bucket.purchases = await Purchases.find({ memberId }).fetchAsync()
      bucket.carts = await Carts.find({ memberId }).fetchAsync()
      let contents = JSON.stringify(bucket, null, 2)
      contents = contents.replace(
        new RegExp(member.name, 'g'),
        newName
      )
      const newEmail =
        newName.replace(/[ '"\.\,]+/g, '.') + '@nomail.maybe.home'
      contents = contents.replace(
        new RegExp(member.email, 'g'),
        newEmail
      )
      fs.writeFileSync(filename, prefix + contents + postfix, {
        encoding: 'utf8',
      })
    } else {
      throw new Meteor.Error(
        'memberId and newname are mandatory parameters'
      )
    }
  },
  'members.rmSessions': async function (id) {
    const member = await Members.findOneAsync(id)
    if (!member) throw new Meteor.Error('Could not find member ' + id)
    debug(`Removing sessions for ${member.name} ${id}`)
    await Members.updateAsync(id, { $set: { sessions: [] } })
    await Sessions.removeAsync({ memberId: id })
    for (const purchase of await Purchases.find({ memberId: id }).fetchAsync()) {
      await Purchases.updateAsync(id, { $set: { sessions: [] } })
    }
  },
  'members.addPaymentEmail': async function (id, email) {
    const member = await Members.findOneAsync(id)
    if (!member) throw new Meteor.Error('Could not find member ' + id)
    debug(`Adding payment email for ${member.name} ${id}`)
    await Members.updateAsync(id, { $push: { paymentEmails: email } })
  },
})
