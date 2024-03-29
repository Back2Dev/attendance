import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Collections from '/imports/api/collections/schema'
import getCollection from '/imports/api/collections/binder'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

const debug = require('debug')('app:dba-context')

export const CollectionContext = React.createContext()

export const CollectionProvider = ({ children, collectionName, viewName }) => {
  // const { children, collectionName, viewName } = props

  const [rows, setRows] = useState([])

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const { collection } = useTracker(() => {
    debug('run tracker', collectionName)
    Meteor.subscribe('name.collections', { name: collectionName })
    const c = Collections.findOne({ name: collectionName })
    return {
      collection: c,
    }
  }, [collectionName, viewName])

  const theView = React.useMemo(
    () => {
      if (viewName === 'ALL_BY_SCHEMA') {
        return null
      }
      const viewByName = collection?.views?.find((item) => item.slug === viewName)
      if (viewByName) {
        return viewByName
      }
      // find the view which has name Default/default
      const defaultView = collection?.views?.find((item) => ['Default', 'default'].includes(item.slug))
      return defaultView
    },
    [collection, viewName]
  )

  const availableViews = React.useMemo(() => {
    const views = collection?.views?.map((item) => {
      return {
        slug: item.slug,
        name: item.name,
        icon: item.icon,
        sortOrder: item.sortOrder,
      }
    })
    if (views?.length) {
      views.sort((a, b) => a.sortOrder - b.sortOrder)
    }
    return views
  }, [collection])

  const rawC = React.useMemo(() => getCollection(collectionName), [collectionName])

  const getRows = () => {
    if (theView === undefined) {
      return
    }
    Meteor.call(
      'collections.getRows',
      { collectionName, viewSlug: theView?.slug },
      (error, result) => {
        if (error) {
          showError(error.message)
          return
        }
        if (result?.status === 'failed') {
          showError(result.message)
          return
        }
        setRows(result.rows)
      }
    )
  }

  useEffect(() => {
    if (!rawC) {
      return
    }

    // build the filter
    debug('calling collections.getRows', collectionName, theView?.slug)
    getRows()
  }, [collectionName, theView])

  const updateCell = ({ rowId, column, value, cb, localOnly }) => {
    debug('updateCell', { rowId, column, value })

    // call api to update data
    if (localOnly !== true) {
      Meteor.call(
        'collections.updateCell',
        {
          collectionName,
          rowId,
          column,
          value,
        },
        (error, result) => {
          if (error) {
            showError(error.message)
            return
          }
          if (result?.status === 'failed') {
            showError(result?.message)
            typeof cb === 'function' && cb(result)
            return
          }
          if (result?.status === 'success') {
            showSuccess('Data updated')
            typeof cb === 'function' && cb(result)
          }
        }
      )
    }
    const newRows = rows.map((row) => {
      if (row._id === rowId) {
        const newRow = { ...row }
        newRow[column] = value
        return newRow
      }
      return row
    })
    setRows(newRows)
  }

  const archive = ({ selectedIds, label }) => {
    debug('archive', selectedIds, label)
    Meteor.call(
      'collections.archive',
      {
        collectionName,
        label,
        recordIds: selectedIds,
      },
      (error, result) => {
        if (error) {
          showError(error.message)
          return
        }
        if (result?.status === 'failed') {
          showError(result?.message)
          return
        }
        if (result?.status === 'success') {
          showSuccess(result.message)
        }

        // reload data
        getRows()
      }
    )
  }

  return (
    <CollectionContext.Provider
      value={{
        theCollection: rawC?.collection,
        schema: rawC?.schema,
        theView,
        rows,
        availableViews,
        updateCell,
        archive,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

CollectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  collectionName: PropTypes.string,
  viewName: PropTypes.string,
}

export const CollectionConsumer = CollectionContext.Consumer
