import Promos from './schema'
import Members from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  'rm.Promos': async (id) => {
    await Promos.removeAsync(id)
  },
  'update.Promos': async (form) => {
    const id = form._id
    delete form._id
    await Promos.updateAsync(id, { $set: form })
  },
  'add.Promos': async (form) => {
    await Promos.insertAsync(form)
  },
  getPromo: async (searchStr, memberId) => {
    debug(`Finding promo code ${searchStr}`)
    const code = searchStr.toUpperCase()
    const promo = await Promos.findOneAsync({ code })
    const member = await Members.findOneAsync(memberId)
    // debug(promo)
    return { promo, member }
  }
})
