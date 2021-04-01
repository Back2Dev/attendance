import { Meteor } from 'meteor/meteor'
import MessageTemplates from '/imports/api/message-templates/schema'
import Profiles from '/imports/api/profiles/schema'

const debug = require('debug')('b2b:migrations')

/*
 * Data migration as required... Migrations will have a finite lifetime,
 * and be removed after some period. To assist with this activity, please
 * add a comment with the following:
 * - Your initials
 * - a date
 * - Why it's there
 *
 * eg // MK 25/1/2021 - Added status, `deleted` is deprecated
 *
 * and a comment at the end of it with END your initials and the date, eg
 * // END MK 25/1/2021
 *
 * Always add new migrations to the end of the file, and we'll remove
 * from the top
 */
Meteor.startup(() => {
  if (Meteor.isServer) {
    // MK 25/1/2021 - Added status, `deleted` is deprecated
    Profiles.update(
      { status: { $exists: false } },
      {
        $set: { status: 'active' },
      },
      { multi: true }
    )
  }
  // END MK 25/1/2021
  // MK 28/2/2021 - Fix email subjects
  MessageTemplates.find({ type: 'EMAIL', subject: { $exists: false } }).forEach((msg) => {
    MessageTemplates.update(msg._id, {
      $set: { subject: msg.slug.replace(/[\-]/g, ' ') },
    })
  })
  // END MK 28/2/2021
})
