import { Meteor } from 'meteor/meteor'
import Events, { CourseItemSchema } from '../events/schema'
import Locations from './schema'
const debug = require('debug')('app:locations')

Meteor.methods({
  'rm.locations': async (id) => {
    try {
      const n = await Locations.removeAsync(id)
      return { status: 'success', message: `Removed course` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing course: ${e.message}`,
      }
    }
  },
  'update.locations': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Locations.updateAsync(id, { $set: form })

      // update the event
      if (n) {
        const updatedLocation = await Locations.findOneAsync({ _id: id })

        // update the Event course
        await Events.updateAsync(
          { 'course._id': id },
          {
            $set: {
              course: CourseItemSchema.clean(updatedLocation),
            },
          },
          { multi: true }
        )

        // update the Event backupCourse
        await Events.updateAsync(
          { 'backupCourse._id': id },
          {
            $set: {
              backupCourse: CourseItemSchema.clean(updatedLocation),
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
  'insert.locations': async (form) => {
    try {
      const id = await Locations.insertAsync(form)
      return { status: 'success', message: `Added course` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding course: ${e.message}`,
      }
    }
  },
  'update.page.locations': async ({ id, model }) => {
    try {
      await Locations.updateAsync(id, {
        $set: {
          pageContent: model,
        },
      })
      return { status: 'success', message: 'Added page to course' }
    } catch (e) {
      console.log(e.message)
      return {
        status: 'failed',
        message: `Error when adding page to course: ${e.message}`,
      }
    }
  },
})
