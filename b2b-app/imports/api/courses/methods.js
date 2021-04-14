import { Meteor } from 'meteor/meteor'
import Courses from './schema'
const debug = require('debug')('b2b:courses')

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
})
