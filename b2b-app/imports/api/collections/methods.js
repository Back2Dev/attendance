import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Collections from './schema'
const debug = require('debug')('app:collections')

import { getSlugFromString } from '/imports/api/utils/misc.js'
import { hasOneOfRoles } from '/imports/api/users/utils.js'
import getCollection from './collections'
import { UpdateViewProps } from './schema'

Meteor.methods({
  'collections.updateView'({ collectionName, viewSlug, viewName, readOnly, columns }) {
    // validate data
    try {
      !UpdateViewProps.validate({
        collectionName,
        viewSlug,
        viewName,
        readOnly,
        columns,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
    debug(collectionName, viewSlug, viewName, readOnly, columns)

    // check to make sure this user has Admin role
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }

    const viewItem = {
      slug: viewSlug || getSlugFromString(viewName),
      name: viewName,
      columns,
      readOnly,
    }

    // find the collection
    const dbStuff = getCollection(collectionName)
    if (!dbStuff) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    // find the record in Collections
    const collection = Collections.findOne({ name: collectionName })
    if (!collection) {
      // then we need to create new collection
      const collectionId = Collections.insert({
        name: collectionName,
        views: [viewItem],
      })

      return { status: 'success', message: '', collectionId, view: viewItem }
    } else {
      let existingView = false
      const newViews = collection.views.map((item) => {
        if (item.slug === viewItem.slug) {
          existingView = true
          return { ...item, ...viewItem }
        }
        return item
      })
      if (!existingView) {
        newViews.push(viewItem)
      }

      const n = Collections.update(
        {
          name: collectionName,
        },
        {
          $set: {
            views: newViews,
          },
        }
      )

      return {
        status: n ? 'success' : 'failed',
        message: n ? '' : 'unable to update',
        view: viewItem,
      }
    }
  },
  'collections.getRows'({ collectionName, filter }) {
    if (!Match.test(collectionName, String)) {
      return { status: 'failed', message: 'Invalid collection name' }
    }

    if (!Match.test(filter, [String])) {
      return { status: 'failed', message: 'Invalid filter' }
    }

    // check to make sure this user has Admin role
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }

    const { collection } = getCollection(collectionName)
    if (!collection) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    // get all data for now
    return {
      status: 'success',
      rows: collection.find({}).fetch(),
    }
  },
  'rm.collections': (id) => {
    try {
      const n = Collections.remove(id)
      return { status: 'success', message: `Removed collection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing collection: ${e.message}`,
      }
    }
  },
  'update.collections': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Collections.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} collection(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating collection: ${e.message}`,
      }
    }
  },
  'insert.collections': (form) => {
    try {
      const id = Collections.insert(form)
      return { status: 'success', message: `Added collection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding collection: ${e.message}`,
      }
    }
  },
})
