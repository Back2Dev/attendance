import { Meteor } from 'meteor/meteor' // base
import moment from 'moment'
import XLSX from 'xlsx'
import Members from '/imports/api/members/schema'
import Rejects from '/imports/api/members/rejects'
import Products from '/imports/api/products/schema'
import Purchases from '/imports/api/purchases/schema'

// Commented out to prevent build/boot probs
// import guess from '/server/gender-guess'

const debug = require('debug')('b2b:members-import-pa')

const type2code = {
  Casual: 'PA-CASUAL',
  'Casual attendance': 'PA-CASUAL',
  '10-session multipass': 'PA-PASS-MULTI-10',
  'Subscription (per month)': 'PA-MEMB-1',
  Yearly: 'PA-MEMB-12',
  '12-month unlimited': 'PA-MEMB-12',
  '3-month unlimited': 'PA-MEMB-3',
  '3-month': 'PA-MEMB-3',
  '3 month': 'PA-MEMB-3'
}

Meteor.methods({
  'patch.pa': async function (secret) {
    const mapping = {
      'First Name': 'firstname',
      'Last Name': 'lastname',
      address: 'addressStreet',
      Suburb: 'addressSuburb',
      State: 'addressState',
      Postcode: 'addressPostcode',
      'Email ': 'email',
      Notes: 'status'
    }
    const membersArray = JSON.parse(Assets.getText('pa.json'))
    for (const member of membersArray) {
      try {
        const sub = { price: 0 }
        Object.keys(mapping).forEach(key => {
          if (member[key]) {
            member[mapping[key]] = member[key]
            delete member[key]
          }
        })
        member.name = `${member.firstname.trim()} ${member.lastname.trim()}`
        sub.remaining = member.remaining || 0
        if (sub.remaining === 'N/A') sub.remaining = 0
        const existing = member.email
          ? await Members.findOneAsync({ email: member.email })
          : await Members.findOneAsync({ name: member.name })
        if (existing) {
          await Purchases.updateAsync({ memberId: existing._id }, { $set: { remaining: sub.remaining } })
        }
      } catch (error) {
        debug(`Error [${error.message}], Failed to fix `, member)
        member.reason = error.message
        await Rejects.insertAsync(member)
      }
    }
  },
  'import.pa': async function (secret) {
    const mapping = {
      'First Name': 'firstname',
      'Last Name': 'lastname',
      address: 'addressStreet',
      Suburb: 'addressSuburb',
      State: 'addressState',
      Postcode: 'addressPostcode',
      'Email ': 'email',
      Notes: 'status'
    }
    const genderAvatars = {
      M: [1, 2, 7, 9, 12, 14, 15, 'test10', 'test11', 'test14', 'test15', 'test19', 'test21'],
      F: [4, 5, 3, 6, 8, 10, 11, 13, 16, 'test17', 'test18']
    }
    const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))
    const getAvatar = name => {
      // detect the gender:
      const g = guess(name)
      if (g.gender) {
        const img = genderAvatars[g.gender][getRandomInt(genderAvatars[g.gender].length)]
        return img.toString().match(/test/) ? `${img}.png` : `${img}.jpg`
      }
      return 'default.jpg'
    }
    if (true) {
      // specialMember === specialMember) {
      //
      // Clean up
      //
      await Rejects.removeAsync({})
      await Members.removeAsync({})
      await Purchases.removeAsync({})

      debug('importing members....')
      const membersArray = JSON.parse(Assets.getText('pa.json'))
      for (const member of membersArray) {
        try {
          const sub = { price: 0 }
          Object.keys(mapping).forEach(key => {
            if (member[key]) {
              member[mapping[key]] = member[key]
              delete member[key]
            }
          })
          member.name = `${member.firstname.trim()} ${member.lastname.trim()}`
          // if (member.type && member.type.match(/multipass/)) {
          //   delete member.type
          // }
          if (!type2code[member.type]) {
            if (member.type) debug(`Type [${member.type}] not found for ${member.name}`)
          } else {
            sub.code = type2code[member.type]
            sub.expiry = moment(member.expiry).toISOString()
            sub.remaining = member.remaining || 0
            if (sub.remaining === 'N/A') sub.remaining = 0
            sub.txnDate = moment(member['Purchase date']).toISOString()
            sub.purchaser = member.name
            sub.price = 0
            const product = await Products.findOneAsync({ code: sub.code })
            if (!product) {
              debug(`Could not find product with code ${sub.code}`)
            } else {
              sub.productId = product._id
              sub.price = product.price
              sub.productName = product.name
            }
          }
          const existing = member.email
            ? await Members.findOneAsync({ email: member.email })
            : await Members.findOneAsync({ name: member.name })

          member.avatar = getAvatar(member.firstname)
          if (existing) {
            debug(`${member.name} exists already`)
            member.reason = 'Duplicate'
            await Rejects.insertAsync(member)
          } else {
            debug(`+ ${member.name} ${sub.code} ${sub.remaining} $${sub.price / 100}`)
            sub.memberId = await Members.insertAsync(member)
            if (sub.code) await Purchases.insertAsync(sub)
          }
        } catch (error) {
          debug(`Error [${error.message}], Failed to import `, member)
          member.reason = error.message
          await Rejects.insertAsync(member)
        }
      }
    } else {
      throw new Meteor.Error(`Members import was moved to a private repo 
        for security reasons (unless you know a secret code)`)
    }
  },
  'update.wix.email': async (data, force) => {
    // name	first	last	photo	email1type	email1	email2type	email2	phone1type	phone1	phone2type	phone2	phone3type	phone3
    let countTotal = 0
    if (Meteor.isClient) return
    try {
      debug(`Loading names from spreadsheet data: ${data}`)
      const wb = XLSX.readFile(data)
      const sheets = wb.SheetNames
      for (const s of sheets) {
        try {
          const people = XLSX.utils.sheet_to_json(wb.Sheets[s], {
            // raw: true
            // header: ['partNo', 'name', 'wholesalePrice', 'barcode']
          })
          for (const p of people) {
            //First Name	Last Name	Email	Phone
            const r = {}
            r.name = `${p['First Name']} ${p['Last Name']}`
            r.email = p.Email
            r.mobile = p.Phone
            if (!r.name || r.name === 'undefined undefined') continue
            if (r.mobile && r.mobile.length === 9 && r.mobile.match(/^4/)) {
              r.mobile = `0${r.mobile}`
            }
            r.name = r.name.replace(/undefined/g, '').trim()
            const searchFor = new RegExp(r.name, 'i')
            const m = await Members.findOneAsync({ name: searchFor })
            if (m) {
              const details = {}
              if (r.email) details.email = r.email
              if (r.mobile) details.mobile = r.mobile
              if (details) {
                'mobile email'.split(/\s+/).forEach(key => {
                  if (details[key]) details[key] = details[key].replace(/Â/g, '')
                  if (!force && m[key] && m[key] !== '') {
                    delete details[key]
                  }
                })
                if (Object.keys(details).length) {
                  debug(`Updating ${m.name}`, details)
                  await Members.updateAsync(m._id, { $set: details })
                  countTotal++
                }
              } else {
                debug(`No mobile or email for ${m.name}`)
              }
            } else debug(`Not found: ${r.name}`)
          }
        } catch (e) {
          console.error(`Couldn't update emails from worksheet ${s}: `, e)
        }
      }
      return countTotal
    } catch (e) {
      debug(e)
      throw new Meteor.Error(500, e)
    }
  },
  'update.email': async (data, force) => {
    let countTotal = 0
    if (Meteor.isClient) return
    const getDetails = (name, r) => {
      const result = {}
      let email = r.email1 || r.email2
      let mobile
      let phone
      for (let i = 1; i <= 3; i++) {
        if (r[`phone${i}type`] === 'Work') mobile = r[`phone${i}`]
      }
      for (let i = 1; i <= 3; i++) {
        if (r[`phone${i}type`] === 'Home') phone = r[`phone${i}`]
      }
      if (!mobile)
        for (let i = 1; i <= 3; i++) {
          if (r[`phone${i}type`] === 'Other') mobile = r[`phone${i}`]
        }
      if (!email && !mobile && !phone) return null
      if (mobile) result.mobile = mobile
      if (email) result.email = email
      if (phone) result.phone = phone
      return result
    }
    try {
      debug(`Loading names from spreadsheet data: ${data}`)
      const wb = XLSX.readFile(data)
      const sheets = wb.SheetNames
      for (const s of sheets) {
        try {
          const people = XLSX.utils.sheet_to_json(wb.Sheets[s], {
            // raw: true
            // header: ['partNo', 'name', 'wholesalePrice', 'barcode']
          })
          for (const p of people) {
            const searchFor = new RegExp(p.name, 'i')
            const m = await Members.findOneAsync({ name: searchFor })
            if (m) {
              const details = getDetails(p.name, p)
              if (details) {
                'mobile phone email'.split(/\s+/).forEach(key => {
                  if (details[key]) details[key] = details[key].replace(/Â/g, '')
                  if (!force && m[key] && m[key] !== '') {
                    delete details[key]
                  }
                })
                if (Object.keys(details).length) {
                  debug(`Updating ${m.name}`, details)
                  await Members.updateAsync(m._id, { $set: details })
                  countTotal++
                }
              } else {
                debug(`No mobile or email for ${m.name}`)
              }
            } else debug(`Not found: ${p.name}`)
          }
        } catch (e) {
          console.error(`Couldn't update emails from worksheet ${s}: `, e)
        }
      }
      return countTotal
    } catch (e) {
      debug(e)
      throw new Meteor.Error(500, e)
    }
  }
})
