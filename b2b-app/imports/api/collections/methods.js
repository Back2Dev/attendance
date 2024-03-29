import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Collections, {
  UpdateViewProps,
  GetRowsProps,
  DeleteViewProps,
  UpdateCellProps,
} from './schema'
import Archives, {
  ArchiveProps,
  RestoreProps,
  GetArchivesProps,
  RemoveProps,
} from './archive-schema'
import { getSlugFromString } from '/imports/api/utils/misc.js'
import { hasOneOfRoles } from '/imports/api/users/utils.js'
import getCollection from './binder'
import { getFieldConditionByFilter } from '/imports/api/collections/utils.js'

const debug = require('debug')('app:collections')

Meteor.methods({
  'collections.getArchives'({ collectionName }) {
    // validate data
    try {
      !GetArchivesProps.validate({
        collectionName,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    // get the archived records
    const conditions = {}
    if (collectionName) {
      conditions.type = collectionName
    }
    return {
      status: 'success',
      rows: Archives.find(conditions).fetch(),
    }
  },
  'collections.removeArchives'({ ids }) {
    // validate data
    try {
      !RemoveProps.validate({
        ids,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    // remove
    Archives.remove({ _id: { $in: ids } }, { multi: true })

    return {
      status: 'success',
      message: 'Removed',
    }
  },
  'collections.restore'({ ids, keepTheCopy = false }) {
    // validate data
    try {
      !RestoreProps.validate({
        ids,
        keepTheCopy,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    const operationSuccess = []
    const operationFailed = []
    ids.map((id) => {
      // find the archived record
      const archivedRecord = Archives.findOne({ _id: id })
      if (!archivedRecord) {
        operationFailed.push(id)
        return
      }

      // find the collection
      const { collection: dbCollection } = getCollection(archivedRecord.type)
      if (!dbCollection) {
        operationFailed.push(id)
        return
      }

      // restore the data
      const restoredRecordIds = []
      archivedRecord.data.map((archivedDataItem) => {
        let insertedId
        try {
          insertedId = dbCollection.insert(JSON.parse(archivedDataItem.data))
          restoredRecordIds.push(insertedId)
        } catch (e) {
          debug('error inserting', archivedRecord.type, archivedDataItem.data)
          return
        }
      })
      if (restoredRecordIds.length !== archivedRecord.data.length) {
        operationFailed.push(id)
      }

      if (!keepTheCopy) {
        // remove the archived data
        Archives.remove({ _id: id })
      }

      operationSuccess.push(id)
    })

    if (operationSuccess.length === 0) {
      return {
        status: 'failed',
        message: 'Unable to restore selected records',
      }
    }

    if (operationFailed.length > 0) {
      return {
        status: 'success',
        message: `Unable to restore some records: ${operationFailed.join(', ')}`,
      }
    }

    return {
      status: 'success',
      message: 'restored',
    }
  },
  'collections.archive'({ collectionName, label, recordIds }) {
    // validate data
    try {
      !ArchiveProps.validate({
        collectionName,
        label,
        recordIds,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    // find the collection
    const { collection: dbCollection } = getCollection(collectionName)
    if (!dbCollection) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    // get the record
    const theRecords = dbCollection.find({ _id: { $in: recordIds } }).fetch()
    if (!theRecords.length) {
      return {
        status: 'failed',
        message: `Record was not found with ids: ${recordIds.join(
          ', '
        )} in collection ${collectionName}`,
      }
    }

    // insert all records to archives collection
    const insertedId = Archives.insert({
      type: collectionName,
      label,
      data: theRecords.map((theRecord) => {
        return {
          dataId: theRecord._id,
          data: JSON.stringify(theRecord),
        }
      }),
      createdBy: {
        userId: me._id,
        username: me.username,
      },
    })
    if (!insertedId) {
      return {
        status: 'failed',
        message: 'Unable to create new archive record',
      }
    }

    // remove the record from original collection
    const n = dbCollection.remove({ _id: { $in: recordIds } })
    debug('removed', n)
    if (!n) {
      return {
        status: 'failed',
        message: 'Unable to remove archived records',
      }
    }

    return {
      status: 'success',
      message: `Archived ${n} records`,
    }
  },
  'collections.updateCell'({ collectionName, rowId, column, value }) {
    // validate data
    try {
      !UpdateCellProps.validate({
        collectionName,
        rowId,
        column,
        value,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    // find the record in Collections
    const collection = Collections.findOne({ name: collectionName })
    if (!collection) {
      return { status: 'failed', message: 'Collection was not found' }
    }

    // find the collection
    const { collection: dbCollection } = getCollection(collectionName)
    if (!dbCollection) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    // peform update
    try {
      const affectedRows = dbCollection.update(
        { _id: rowId },
        {
          $set: {
            [column]: value,
          },
        }
      )
      return { status: 'success', affectedRows }
    } catch (e) {
      return { status: 'failed', message: `Update error: ${e.message}` }
    }
  },
  'collections.deleteView'({ collectionName, viewSlug }) {
    // validate data
    try {
      !DeleteViewProps.validate({
        collectionName,
        viewSlug,
      })
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
    debug(collectionName, viewSlug)

    // check to make sure this user has Admin role
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const me = Meteor.users.findOne({ _id: this.userId })
    const allowed = hasOneOfRoles(me, ['ADM'])
    if (!allowed) {
      return { status: 'failed', message: 'Permission denied' }
    }

    // find the record in Collections
    const collection = Collections.findOne({ name: collectionName })
    if (!collection) {
      return { status: 'failed', message: 'Collection was not found' }
    }

    const n = Collections.update(
      { name: collectionName },
      {
        $pull: { views: { slug: viewSlug } },
      }
    )

    if (n === 0) {
      return {
        status: 'failed',
        message: 'Unable to remove the view',
      }
    }
    return {
      status: 'success',
      message: '',
    }
  },
  'collections.updateView'({
    collectionName,
    viewSlug,
    viewName,
    readOnly,
    columns,
    sortOrder,
  }) {
    // validate data
    try {
      !UpdateViewProps.validate({
        collectionName,
        viewSlug,
        viewName,
        readOnly,
        columns,
        sortOrder,
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
      sortOrder,
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
  'collections.getRows'({ collectionName, viewSlug }) {
    try {
      GetRowsProps.validate({ collectionName, viewSlug })
    } catch (error) {
      return { status: 'failed', message: error.message }
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

    const { collection: dbCollection, schema } = getCollection(collectionName)
    if (!dbCollection) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    const collection = Collections.findOne({ name: collectionName })

    const conditions = []
    const queryOptions = {
      fields: {},
      sort: {},
    }
    if (collection && viewSlug) {
      const theView = collection.views?.find((item) => item.slug === viewSlug)
      // debug({ viewSlug, theView })
      if (theView) {
        theView.columns.map((col) => {
          queryOptions.fields[col.name] = 1
          if (col.filter) {
            const fieldCondition = getFieldConditionByFilter({
              fieldName: col.name,
              schema,
              filter: col.filter,
            })
            if (fieldCondition) {
              conditions.push(fieldCondition)
            }
          }
        })
        debug('sortOrder', theView.sortOrder)
        if (theView.sortOrder) {
          queryOptions.sort[theView.sortOrder.column] =
            theView.sortOrder.order === 'ASC' ? 1 : -1
        }
      }
    }

    const queryCondition = {}
    if (conditions.length) {
      queryCondition['$and'] = conditions
    }

    debug(queryCondition, queryOptions)

    return {
      status: 'success',
      rows: dbCollection.find(queryCondition, queryOptions).fetch(),
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
