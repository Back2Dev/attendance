import { Meteor } from 'meteor/meteor'
import Events, { CourseItemSchema } from '../events/schema'
import Courses from './schema'
const debug = require('debug')('app:courses')

Meteor.methods({
  'rm.courses': (id) => {
    try {
      const n = Courses.remove(id)
      return { status: 'success', message: `Removed course` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing course: ${e.message}`,
      }
    }
  },
  'update.courses': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Courses.update(id, { $set: form })

      // update the event
      if (n) {
        const updatedCourse = Courses.findOne({ _id: id })

        // update the Event course
        Events.update(
          { 'course._id': id },
          {
            $set: {
              course: CourseItemSchema.clean(updatedCourse),
            },
          },
          { multi: true }
        )

        // update the Event backupCourse
        Events.update(
          { 'backupCourse._id': id },
          {
            $set: {
              backupCourse: CourseItemSchema.clean(updatedCourse),
            },
          },
          { multi: true }
        )
      }

      return { status: 'success', message: `Updated ${n} course(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating course: ${e.message}`,
      }
    }
  },
  'insert.courses': (form) => {
    try {
      const id = Courses.insert(form)
      return { status: 'success', message: `Added course` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding course: ${e.message}`,
      }
    }
  },
  'update.page.courses': ({ id, model }) => {
    try {
<<<<<<< HEAD
      Courses.update(id, {$set: {
        pageContent: model
      }})
      return {status: 'sucess', message: 'Added page to course'}
=======
      Courses.update(id, {
        $set: {
          pageContent: model,
        },
      })
      return { status: 'success', message: 'Added page to course' }
>>>>>>> 157086bc2b964c4aa863ff9380ca1f57982fe71a
    } catch (e) {
      console.log(e.message)
      return {
        status: 'failed',
        message: `Error when adding page to course: ${e.message}`,
      }
    }
  },
})
