import Promos from './schema'
import Members from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  getPromo(code) {
    debug(`Finding promo code ${code}`)
    const promo = Promos.findOne({ code })
    // debug(promo)
    return promo
  }
})
