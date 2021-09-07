import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Collections from '/imports/api/collections/schema'
import getCollection from '/imports/api/collections/collections.js'

import { showError } from '/imports/ui/utils/toast-alerts.js'

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
    console.log('run tracker', collectionName)
    Meteor.subscribe('name.collections', { name: collectionName })
    const c = Collections.findOne({ name: collectionName })
    return {
      collection: c,
    }
  }, [collectionName, viewName])

  const theView = React.useMemo(
    () => collection?.views?.filter((item) => item.name === viewName),
    [collection]
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

  useEffect(() => {
    if (!rawC) {
      return
    }

    // build the filter
    const filter = []
    if (theView?.columns) {
      theView.columns.map((col) => {
        if (col.filter) {
          filter.push({
            column: col.name,
            filter: col.filter,
          })
        }
      })
    }

    console.log('calling collections.getRows', collectionName, filter)
    Meteor.call('collections.getRows', { collectionName, filter }, (error, result) => {
      if (error) {
        showError(error.message)
        return
      }
      if (result?.status === 'failed') {
        showError(result.message)
        return
      }
      setRows(result.rows)
    })
  }, [collectionName])

  return (
    <CollectionContext.Provider
      value={{
        theCollection: rawC?.collection,
        schema: rawC?.schema,
        theView,
        rows,
        availableViews,
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
