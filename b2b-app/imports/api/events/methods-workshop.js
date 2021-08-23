import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import moment from 'moment'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import { MemberItemSchema } from '/imports/api/events/schema'
import Courses from '/imports/api/courses/schema.js'
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
  'create.workshop': (form) => {
    try {
      Sessions.remove({})
      // Events.remove({})
      const { start, weeks, code, coach, course } = form
      Events.remove({ code: `${code}-${start}` })
      const trainer = Members.findOne({ name: coach })
      const theCourse = Courses.findOne({ title: course })
      let week = 0
      weeks.split('').forEach((wk, ix) => {
        if (wk.match(/y/i)) {
          const when = moment(start)
            .add(ix * 7, 'day')
            .format('YYYY-MM-DD')
          const eventId = Events.insert({
            type: 'once',
            status: 'active',
            duration: 3,

            code: `${code}-${start}`,
            when,
            name: unit[week].name,
            courseId: theCourse?._id,
          })
          const sId = Sessions.insert({
            memberId: trainer?._id,
            name: unit[week].name,
            memberName: coach,
            role: 'COA',
            status: 'booked',
            bookedDate: when,
            bookedAt: new Date(),
            eventId,
          })
          trainer.session = Sessions.findOne(sId)
          Events.update(eventId, { $push: { members: trainer } })
          week = week + 1
        }
      })

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
