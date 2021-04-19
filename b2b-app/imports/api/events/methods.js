import { Meteor } from 'meteor/meteor'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import Courses from '/imports/api/courses/schema.js'
import Events, { BookParamsSchema, CancelBookingParamsSchema } from './schema'
const debug = require('debug')('b2b:events')

Meteor.methods({
  'cancel.events'({ sessionId }) {
    debug({ sessionId })
    try {
      CancelBookingParamsSchema.validate({ sessionId })
    } catch (error) {
      debug(error)
      return { status: 'failed', message: error.message }
    }

    // check for login user
    const user = Meteor.user()
    if (!user) {
      return { status: 'failed', message: 'Please login' }
    }

    const member = Members.findOne({ userId: user._id })
    if (!member) {
      return { status: 'failed', message: `Member was not found with userId ${user._id}` }
    }

    // select the session
    const session = Sessions.findOne({ _id: sessionId, memberId: member._id })
    if (!session) {
      return {
        status: 'failed',
        message: `Your session was not found with id ${sessionId}`,
      }
    }

    try {
      const updated = Sessions.update(
        {
          _id: session._id,
        },
        {
          $set: { status: 'cancelled' },
        }
      )
      if (!updated) {
        return { status: 'failed', message: 'Unable to update session' }
      }
    } catch (e) {
      return { status: 'failed', message: `Error updating session ${e.message}` }
    }

    return { status: 'success' }
  },
  'book.events'({ eventId, toolId }) {
    debug({ eventId, toolId })
    try {
      BookParamsSchema.validate({ eventId, toolId })
    } catch (error) {
      debug(error)
      return { status: 'failed', message: error.message }
    }

    // select the event
    const event = Events.findOne({ _id: eventId })
    if (!event) {
      return { status: 'failed', message: `Event was not found with id ${eventId}` }
    }
    // check if the tool are valid
    let foundTool
    if (toolId) {
      if (event.tools?.length) {
        event.tools.map((tool) => {
          if (tool._id === toolId && tool.available !== false) {
            foundTool = tool
          }
        })
      }
      if (!foundTool) {
        return {
          status: 'failed',
          message: `Selected tool are invalid or not available ${toolId}`,
        }
      }
    }
    debug({ foundTool })

    // check for login user
    const user = Meteor.user()
    if (!user) {
      return { status: 'failed', message: 'Please login' }
    }
    const member = Members.findOne({ userId: user._id })
    if (!member) {
      return { status: 'failed', message: `Member was not found with userId ${user._id}` }
    }

    // get the course
    const course = Courses.findOne({ _id: event.courseId })

    // now everything looks good, create a new session
    const sessionName = `${event.name}: ${course.title}`

    let sessionId
    try {
      sessionId = Sessions.insert({
        memberId: member._id,
        eventId: eventId,
        name: sessionName,
        memberName: member.name,
        status: 'booked',
        toolId: toolId || null,
        toolName: foundTool?.name || null,
        bookedDate: event.when,
        bookedAt: new Date(),
      })
    } catch (e) {
      return { status: 'failed', message: `Error inserting new session ${e.message}` }
    }

    return { status: 'success', sessionId }
  },
  'rm.events': (id) => {
    try {
      const n = Events.remove(id)
      return { status: 'success', message: 'Removed event' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing event: ${e.message}`,
      }
    }
  },
  'update.events': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Events.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} event(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating event: ${e.message}`,
      }
    }
  },
  'insert.events': (form) => {
    try {
      const id = Events.insert(form)
      return { status: 'success', message: 'Added event' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
})
