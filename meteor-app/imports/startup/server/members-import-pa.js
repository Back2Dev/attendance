import { Meteor } from 'meteor/meteor' // base
import moment from 'moment'
import Members from '/imports/api/members/schema'
import Rejects from '/imports/api/members/rejects'
import Products from '/imports/api/products/schema'
import Purchases from '/imports/api/purchases/schema'
import Events from '/imports/api/events/schema'

import guess from '/server/gender-guess'

const debug = require('debug')('b2b:members-import-pa')

const type2code = {
  Casual: 'PA-PASS-CASUAL',
  'Casual attendance': 'PA-PASS-CASUAL',
  '10-session multipass': 'PA-PASS-MULTI-10',
  'Subscription (per month)': 'PA-MEMB-1',
  Yearly: 'PA-MEMB-12',
  '12-month unlimited': 'PA-MEMB-12',
  '3-month unlimited': 'PA-MEMB-3',
  '3-month': 'PA-MEMB-3',
  '3 month': 'PA-MEMB-3'
}

Meteor.methods({
  'import.pa'(secret) {
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
    const getRandomInt = max => {
      return Math.floor(Math.random() * Math.floor(max))
    }
    const getAvatar = name => {
      // detect the gender:
      const g = guess(name)
      if (g.gender) {
        const img = genderAvatars[g.gender][getRandomInt(genderAvatars[g.gender].length)]
        return img.toString().match(/test/) ? `${img}.png` : `${img}.jpg`
      } else {
        return 'default.jpg'
      }
    }
    if (true) {
      //specialMember === specialMember) {
      //
      // Clean up
      //
      Rejects.remove({})
      Members.remove({})
      Purchases.remove({})

      debug('importing members....')
      const membersArray = JSON.parse(Assets.getText('pa.json'))
      membersArray.forEach(member => {
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
            const product = Products.findOne({ code: sub.code })
            if (!product) {
              debug(`Could not find product with code ${sub.code}`)
            } else {
              sub.productId = product._id
              sub.price = product.price
            }
          }
          const existing = member.email
            ? Members.findOne({ email: member.email })
            : Members.findOne({ name: member.name })

          member.avatar = getAvatar(member.firstname)
          if (existing) {
            debug(`${member.name} exists already`)
            member.reason = 'Duplicate'
            Rejects.insert(member)
          } else {
            debug(`+ ${member.name} ${sub.code} ${sub.remaining} $${sub.price / 100}`)
            sub.memberId = Members.insert(member)
            if (sub.code) Purchases.insert(sub)
          }
        } catch (error) {
          debug(`Error [${error.message}], Failed to import `, member)
          member.reason = error.message
          Rejects.insert(member)
        }
      })
    } else {
      throw new Meteor.Error(`Members import was moved to a private repo 
        for security reasons (unless you know a secret code)`)
    }
  }
})
