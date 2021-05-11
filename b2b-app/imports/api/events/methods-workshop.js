import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import Courses from '/imports/api/courses/schema.js'
import Events, { BookParamsSchema, CancelBookingParamsSchema } from './schema'
const debug = require('debug')('b2b:events')

const course = [
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
   * @param {String} sessionId
   * @returns {Object} result
   * @returns {String} result.status
   * @returns {String} result.message
   */

  'create.workshop': (form) => {
    try {
      const { start, weeks, code } = form
      Events.remove({ code: `${code}-${start}` })
      let week = 0
      weeks.split('').forEach((wk, ix) => {
        if (wk.match(/y/i)) {
          const id = Events.insert({
            type: 'once',
            active: true,
            duration: 3,
            code: `${code}-${start}`,
            when: moment(start)
              .add(ix * 7, 'day')
              .format('YYYY-MM-DD'),
            name: course[week].name,
          })
          week = week + 1
        }
      })

      return { status: 'success', message: 'Added events' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
})
