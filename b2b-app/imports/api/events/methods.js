import { Meteor } from 'meteor/meteor'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import Courses from '/imports/api/courses/schema.js'
import Events, { BookParamsSchema } from './schema'
const debug = require('debug')('b2b:events')

Meteor.methods({
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
        foundTool = event.tools.some((tool) => {
          return tool._id === toolId && tool.available !== false
        })
      }
      if (!foundTool) {
        return {
          status: 'failed',
          message: `Selected tool are invalid or not available ${toolId}`,
        }
      }
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
