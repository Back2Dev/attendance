import { Meteor } from 'meteor/meteor'
import Sessions from '/imports/api/sessions/schema.js'
import Members from '/imports/api/members/schema.js'
import Courses from '/imports/api/courses/schema.js'
import Events, {
  BookParamsSchema,
  CancelBookingParamsSchema,
  MemberItemSchema,
  CourseItemSchema,
} from './schema'
import moment from 'moment'
const debug = require('debug')('app:events')

Meteor.methods({
  /**
   * Cancel booked session
   * @param {Object} params
   * @param {String} params.sessionId
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

    // remove the member item inside the event.members
    Events.update(
      {
        _id: session.eventId,
      },
      {
        $pull: {
          members: { 'session._id': session._id },
        },
      }
    )

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
   * @param {Object} params
   * @param {String} params.eventId
   * @param {String} params.toolId
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
    const memberItem = MemberItemSchema.clean({
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
  'update.events'({ form, recurring }) {
    try {
      const id = form._id
      delete form._id
      const n = Events.update(id, { $set: form })

      if (n) {
        const updateData = {}
        if (form.courseId) {
          // debug(form.courseId)
          const course = Courses.findOne({ _id: form.courseId })
          if (course) {
            updateData.course = CourseItemSchema.clean(course)
          }
        }
        if (form.backupCourseId) {
          const backupCourse = Courses.findOne({ _id: form.backupCourseId })
          if (backupCourse) {
            updateData.backupCourse = CourseItemSchema.clean(backupCourse)
          }
        }
        if (updateData.course || updateData.backupCourse) {
          Events.update(
            { _id: id },
            {
              $set: updateData,
            }
          )
        }
      }

      if (n && recurring) {
        const updatedEvent = Events.findOne({ _id: id })
        debug(recurring, updatedEvent)
        const {
          _id,
          when,
          members,
          repeat,
          created,
          updated,
          ...updateData
        } = updatedEvent

        const theRef = updatedEvent.repeat?.ref
          ? updatedEvent.repeat.ref
          : updatedEvent._id

        // todo: update event time

        switch (recurring) {
          case 'this':
            // update this event only, then do nothing
            break
          case 'all':
            Events.update(
              {
                $or: [{ 'repeat.ref': theRef }, { _id: theRef }],
              },
              {
                $set: updateData,
              },
              {
                multi: true,
              }
            )
            // update all events in this series
            break
          case 'furture':
            // update furture events
            Events.update(
              { 'repeat.ref': theRef, when: { $gt: when } },
              {
                $set: updateData,
              },
              {
                multi: true,
              }
            )
            break
          default:
            break
        }
      }

      return { status: 'success', message: `Updated ${n} event(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating event: ${e.message}`,
      }
    }
  },
  'insert.events'({ form }) {
    try {
      const id = Events.insert(form)

      // we need to get the course information and update the event
      if (id) {
        const updateData = {}
        if (form.courseId) {
          // debug(form.courseId)
          const course = Courses.findOne({ _id: form.courseId })
          if (course) {
            updateData.course = CourseItemSchema.clean(course)
          }
        }
        if (form.backupCourseId) {
          const backupCourse = Courses.findOne({ _id: form.backupCourseId })
          if (backupCourse) {
            updateData.backupCourse = CourseItemSchema.clean(backupCourse)
          }
        }
        if (updateData.course || updateData.backupCourse) {
          Events.update(
            { _id: id },
            {
              $set: updateData,
            }
          )
        }
      }

      // handle event recurring
      if (form.repeat?.factor) {
        const insertedEvent = Events.findOne({ _id: id })
        delete insertedEvent._id

        const { factor, every, dow, dom, util } = form.repeat
        // create future events
        let theEventDay
        let theEventWeek
        switch (factor) {
          case 'day':
          case 'month':
          case 'year': {
            theEventDay = moment(form.when).add(every, factor).toDate()
            while (theEventDay < util) {
              // create event
              console.log({ theEventDay })
              Events.insert({
                ...insertedEvent,
                when: theEventDay,
                repeat: {
                  ...insertedEvent.repeat,
                  ref: id,
                },
              })

              // then calculate the next event
              theEventDay = moment(theEventDay).add(every, factor).toDate()
            }
            break
          }
          case 'week': {
            if (dow.length === 0) {
              break
            }
            theEventWeek = moment(form.when).toDate()
            while (theEventWeek < util) {
              dow.map((theDay) => {
                theEventDay = moment(theEventWeek).day(theDay).toDate()
                if (theEventDay < util && theEventDay > form.when) {
                  // create event
                  console.log({ theEventDay }, moment(theEventDay).day())
                  Events.insert({
                    ...insertedEvent,
                    when: theEventDay,
                    repeat: {
                      ...insertedEvent.repeat,
                      ref: id,
                    },
                  })
                }
              })
              theEventWeek = moment(theEventWeek).add(every, factor).toDate()
            }
            break
          }
        }
      }

      return { status: 'success', message: 'Added event', id }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
})
