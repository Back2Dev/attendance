import { Meteor } from 'meteor/meteor'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import Courses from '/imports/api/courses/schema.js'
import Events, {
  BookParamsSchema,
  CancelBookingParamsSchema,
  MemeberItemSchema,
} from './schema'
const debug = require('debug')('b2b:events')

Meteor.methods({
  /**
   * Cancel booked session
   * @param {String} sessionId
   * @returns {Object} result
   * @returns {String} result.status
   * @returns {String} result.message
   */
  'cancel.events'({ sessionId }) {
    debug({ sessionId })
    try {
      CancelBookingParamsSchema.validate({ sessionId })
    } catch (error) {
      debug(error)
      return { status: 'failed', message: error.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }

    const member = Members.findOne({ userId: this.userId })
    if (!member) {
      return {
        status: 'failed',
        message: `Member was not found with userId ${this.userId}`,
      }
    }

    // select the session
    const session = Sessions.findOne({
      _id: sessionId,
      memberId: member._id,
      status: 'booked',
    })
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

    // enable selected tool in the event
    if (session.toolId) {
      Events.update(
        { _id: session.eventId, tools: { $elemMatch: { _id: session.toolId } } },
        {
          $set: { 'tools.$.available': true },
        }
      )
    }

    return { status: 'success' }
  },
  /**
   * Book an event
   * @param {String} eventId
   * @param {String} toolId
   * @returns {Object} result
   * @returns {String} result.status
   * @returns {String} result.message
   * @returns {String} result.sessionId, the session id just created
   */
  'book.events'({ eventId, toolId }) {
    // debug({ eventId, toolId })
    try {
      BookParamsSchema.validate({ eventId, toolId })
    } catch (error) {
      // debug(error)
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
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const member = Members.findOne({ userId: this.userId })
    if (!member) {
      return {
        status: 'failed',
        message: `Member was not found with userId ${this.userId}`,
      }
    }

    // now everything looks good, create a new session
    let sessionName = `${event.name}`

    // get the course
    if (event.courseId) {
      const course = Courses.findOne({ _id: event.courseId })
      sessionName += `: ${course.title}`
    }

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

    // update the members array of event
    const memberItem = MemeberItemSchema.clean({
      ...member,
      session: Sessions.findOne({ _id: sessionId }),
    })
    debug({ memberItem })
    const updateData = {}
    if (event.members) {
      updateData.$push = { members: memberItem }
    } else {
      updateData.$set = { members: [memberItem] }
    }
    debug({ updateData })
    Events.update(
      {
        _id: eventId,
      },
      updateData
    )

    // disable the booked tool
    if (foundTool) {
      Events.update(
        { _id: eventId, tools: { $elemMatch: { _id: foundTool._id } } },
        {
          $set: { 'tools.$.available': false },
        }
      )
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
