import { Meteor } from 'meteor/meteor'
import Parts from '/imports/parts/parts'
import log from '/imports/lib/server/log'

const debug = require('debug')('att:server-methods')

Meteor.methods({
    'parts.insert'(part) {
      try {
        return Parts.insert(part)
      } catch (e) {
        log.error({ e })
        throw new Meteor.Error(500, e.sanitizedError.reason)
      }
    },
    // 'parts.update'(id, wholesalePrice) {
    //   try {
    //     log.info('updating part: ', id, wholesalePrice)
    //     return Parts.update({ _id: id }, { $set: { wholesalePrice } })
    //   } catch (e) {
    //     log.error({ e })
    //     throw new Meteor.Error(500, e.sanitizedError.reason)
    //   }
    // },
})
