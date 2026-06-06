import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import moment from 'moment'
import Bookings from '/imports/api/bookings/schema.js'
import Profiles from '/imports/api/profiles/schema.js'
import { MemberItemSchema } from '/imports/api/events/schema'
import Locations from '/imports/api/locations/schema.js'
import Events, { BookParamsSchema, CancelBookingParamsSchema } from './schema'
const debug = require('debug')('app:events')

const unit = [
  {
    name: '1. Intro and punctures',
  },
  {
    name: 'Brakes',
  },
  { name: 'Gears #1' },
  { name: 'Gears #2' },
  { name: 'Wheel bearings' },
  { name: 'Headsets and bottom brackets' },
]
Meteor.methods({
  /**
   * Create events for a 6 week workshop
   * @param {Object} params
   * @param {Object} params.start - start date
   * @param {Object} params.weeks - Y for each week, use a space or a dash to skip a week,
   *   eg "YYYY" for 4 consecutive weeks
   *   eg "YY YY" for 2 weeks + 1 gap week + 2 weeks
   * @param {Object} params.start - start date
   * @returns {Object} result
   * @returns {String} result.status
   * @returns {String} result.message
   */
  /**  Example:
   * Meteor.call("create.workshop", {
   * start: "2021-07-01",
   * weeks: "YY YY YY",
   * code: "MAINT-6W",
   * coach: "Mike King",
   * course: "Bumble bee"})
   */
  'create.workshop': async (form) => {
    try {
      await Bookings.removeAsync({})
      // Events.remove({})
      const { start, weeks, code, coach, course } = form
      await Events.removeAsync({ code: `${code}-${start}` })
      const trainer = await Profiles.findOneAsync({ name: coach })
      const theCourse = await Locations.findOneAsync({ title: course })
      let week = 0
      const weekFlags = weeks.split('')
      for (let ix = 0; ix < weekFlags.length; ix += 1) {
        const wk = weekFlags[ix]
        if (wk.match(/y/i)) {
          const when = moment(start)
            .add(ix * 7, 'day')
            .format('YYYY-MM-DD')
          const eventId = await Events.insertAsync({
            type: 'once',
            status: 'active',
            duration: 3,

            code: `${code}-${start}`,
            when,
            name: unit[week].name,
            locationId: theCourse?._id,
          })
          const sId = await Bookings.insertAsync({
            profileId: trainer?._id,
            name: unit[week].name,
            memberName: coach,
            role: 'COA',
            status: 'booked',
            bookedDate: when,
            bookedAt: new Date(),
            eventId,
          })
          trainer.session = await Bookings.findOneAsync(sId)
          await Events.updateAsync(eventId, { $push: { members: trainer } })
          week = week + 1
        }
      }

      return { status: 'success', message: 'Added events' }
    } catch (e) {
      debug(`Error adding event: ${e.message}`)
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
})
