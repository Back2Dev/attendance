import Promos from './schema'
import Profiles from '/imports/api/profiles/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('app:server-methods')

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
  getPromo: async (searchStr, profileId) => {
    debug(`Finding promo code ${searchStr}`)
    const code = searchStr.toUpperCase()
    const promo = await Promos.findOneAsync({ code })
    const member = await Profiles.findOneAsync(profileId)
    // debug(promo)
    return { promo, member }
  },
})
