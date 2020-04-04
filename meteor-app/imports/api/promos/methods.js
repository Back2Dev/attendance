import Promos from './schema'
import Members from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  'rm.Promos': id => {
    Promos.remove(id)
  },
  'update.Promos': form => {
    const id = form._id
    delete form._id
    Promos.update(id, { $set: form })
  },
  'add.Promos': form => {
    Promos.insert(form)
  },
  getPromo: (searchStr, memberId) => {
    debug(`Finding promo code ${searchStr}`)
    const code = searchStr.toUpperCase()
    const promo = Promos.findOne({ code })
    const member = Members.findOne(memberId)
    // debug(promo)
    return { promo, member }
  }
})
