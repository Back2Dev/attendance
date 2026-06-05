import { Meteor } from 'meteor/meteor'
import Bookings from '/imports/api/bookings/schema.js'
import Profiles from '/imports/api/profiles/schema.js'
import Locations from '/imports/api/locations/schema.js'
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
   * Cancel booked booking
   * @param {Object} params
   * @param {String} params.bookingId
   * @returns {Object} result
   * @returns {String} result.status
   * @returns {String} result.message
   */
  'cancel.events': async function ({ bookingId }) {
    debug({ bookingId })
    try {
      CancelBookingParamsSchema.validate({ bookingId })
    } catch (error) {
      debug(error)
      return { status: 'failed', message: error.message }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }

    const member = await Profiles.findOneAsync({ userId: this.userId })
    if (!member) {
      return {
        status: 'failed',
        message: `Member was not found with userId ${this.userId}`,
      }
    }

    // select the booking
    const session = await Bookings.findOneAsync({
      _id: bookingId,
      profileId: member._id,
      status: 'booked',
    })
    if (!session) {
      return {
        status: 'failed',
        message: `Your booking was not found with id ${bookingId}`,
      }
    }

    try {
      const updated = await Bookings.updateAsync(
        {
          _id: session._id,
        },
        {
          $set: { status: 'cancelled' },
        }
      )
      if (!updated) {
        return { status: 'failed', message: 'Unable to update booking' }
      }
    } catch (e) {
      return { status: 'failed', message: `Error updating booking ${e.message}` }
    }

    // remove the member item inside the event.members
    await Events.updateAsync(
      { _id: session.eventId },
      {
        $pull: {
          members: { 'session._id': session._id },
        },
      }
    )

    // enable selected tool in the event
    if (session.toolId) {
      await Events.updateAsync(
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
   * @returns {String} result.bookingId, the booking id just created
   */
  'book.events': async function ({ eventId, toolId }) {
    // debug({ eventId, toolId })
    try {
      BookParamsSchema.validate({ eventId, toolId })
    } catch (error) {
      // debug(error)
      return { status: 'failed', message: error.message }
    }

    // select the event
    const event = await Events.findOneAsync({ _id: eventId })
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
    const member = await Profiles.findOneAsync({ userId: this.userId })
    if (!member) {
      return {
        status: 'failed',
        message: `Member was not found with userId ${this.userId}`,
      }
    }

    // now everything looks good, create a new booking
    let sessionName = `${event.name}`

    // get the course
    if (event.courseId) {
      const course = await Locations.findOneAsync({ _id: event.courseId })
      if (course) {
        sessionName += `: ${course.title}`
      }
    }

    let bookingId
    try {
      bookingId = await Bookings.insertAsync({
        profileId: member._id,
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
      return { status: 'failed', message: `Error inserting new booking ${e.message}` }
    }

    // update the members array of event
    const memberItem = MemberItemSchema.clean({
      ...member,
      session: await Bookings.findOneAsync({ _id: bookingId }),
    })
    debug({ memberItem })
    const updateData = {}
    if (event.members) {
      updateData.$push = { members: memberItem }
    } else {
      updateData.$set = { members: [memberItem] }
    }
    debug({ updateData })
    await Events.updateAsync({ _id: eventId }, updateData)

    // disable the booked tool
    if (foundTool) {
      await Events.updateAsync(
        { _id: eventId, tools: { $elemMatch: { _id: foundTool._id } } },
        {
          $set: { 'tools.$.available': false },
        }
      )
    }

    return { status: 'success', bookingId }
  },
  'rm.events': async function ({ id, recurring }) {
    const eventToDelete = await Events.findOneAsync({ _id: id })
    if (!eventToDelete) {
      return {
        status: 'failed',
        message: `Event was not found with id ${id}`,
      }
    }

    try {
      const n = await Events.removeAsync(id)

      if (n) {
        const theRef = eventToDelete.repeat?.ref
          ? eventToDelete.repeat.ref
          : eventToDelete._id

        switch (recurring) {
          case 'this':
            // delete this event only, then do nothing
            break
          case 'all':
            await Events.removeAsync({
              $or: [{ 'repeat.ref': theRef }, { _id: theRef }],
            })
            // update all events in this series
            break
          case 'furture':
            // update furture events
            await Events.removeAsync({
              'repeat.ref': theRef,
              when: { $gt: eventToDelete.when },
            })
            break
          default:
            break
        }
      }

      return { status: 'success', message: 'Removed event' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing event: ${e.message}`,
      }
    }
  },
  'update.events': async function ({ form = {}, id: idParam, recurring }) {
    try {
      const id = form._id || idParam
      if (!id) {
        throw new Meteor.Error('invalid-argument', 'Missing event _id')
      }

      const updateDoc = { ...form }
      delete updateDoc._id
      if (!updateDoc.repeat?.factor) delete updateDoc.repeat
      // Coerce when to Date if it arrived as a string (e.g. from inline grid editor)
      debug('update.events updateDoc.when =', updateDoc.when, typeof updateDoc.when)
      if (updateDoc.when && !(updateDoc.when instanceof Date)) {
        const d = new Date(updateDoc.when)
        updateDoc.when = isNaN(d) ? undefined : d
      }
      const n = await Events.updateAsync(id, { $set: updateDoc })

      if (n) {
        const updateData = {}
        if (updateDoc.courseId) {
          const course = await Locations.findOneAsync({ _id: updateDoc.courseId })
          if (course) {
            updateData.course = CourseItemSchema.clean(course)
          }
        }
        if (updateDoc.backupCourseId) {
          const backupCourse = await Locations.findOneAsync({
            _id: updateDoc.backupCourseId,
          })
          if (backupCourse) {
            updateData.backupCourse = CourseItemSchema.clean(backupCourse)
          }
        }
        if (updateData.course || updateData.backupCourse) {
          await Events.updateAsync(
            { _id: id },
            {
              $set: updateData,
            }
          )
        }
      }

      if (n && recurring) {
        const updatedEvent = await Events.findOneAsync({ _id: id })
        if (!updatedEvent) {
          throw new Meteor.Error('not-found', 'Event not found after update')
        }
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
            await Events.updateAsync(
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
            await Events.updateAsync(
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
  'insert.events': async function ({ form }) {
    try {
      debug('insert.events form.when =', form.when, typeof form.when)
      if (!form.repeat?.factor) delete form.repeat
      // Coerce when to Date if it arrived as a string (e.g. from inline grid editor)
      if (form.when && !(form.when instanceof Date)) {
        const d = new Date(form.when)
        form.when = isNaN(d) ? undefined : d
      }
      const id = await Events.insertAsync(form)

      // we need to get the course information and update the event
      if (id) {
        const updateData = {}
        if (form.courseId) {
          // debug(form.courseId)
          const course = await Locations.findOneAsync({ _id: form.courseId })
          if (course) {
            updateData.course = CourseItemSchema.clean(course)
          }
        }
        if (form.backupCourseId) {
          const backupCourse = await Locations.findOneAsync({ _id: form.backupCourseId })
          if (backupCourse) {
            updateData.backupCourse = CourseItemSchema.clean(backupCourse)
          }
        }
        if (updateData.course || updateData.backupCourse) {
          await Events.updateAsync({ _id: id }, { $set: updateData })
        }
      }

      // handle event recurring
      if (form.repeat?.factor) {
        const insertedEvent = await Events.findOneAsync({ _id: id })
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
              await Events.insertAsync({
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
              for (const theDay of dow) {
                theEventDay = moment(theEventWeek).day(theDay).toDate()
                if (theEventDay < util && theEventDay > form.when) {
                  // create event
                  console.log({ theEventDay }, moment(theEventDay).day())
                  await Events.insertAsync({
                    ...insertedEvent,
                    when: theEventDay,
                    repeat: {
                      ...insertedEvent.repeat,
                      ref: id,
                    },
                  })
                }
              }
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
