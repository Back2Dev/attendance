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

  const { columns, theView } = useTracker(() => {
    console.log('run tracker', collectionName)
    Meteor.subscribe('name.collections', { name: collectionName })
    const c = Collections.findOne({ name: collectionName })

    return {
      columns: c?.columns,
      theView: c?.views?.filter((item) => item.name === viewName),
    }
  }, [collectionName, viewName])

  const rawC = React.useMemo(() => getCollection(collectionName), [collectionName])

  useEffect(() => {
    console.log('calling collections.getRows')
    Meteor.call('collections.getRows', { collectionName }, (error, result) => {
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
        columns,
        theView,
        rows,
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
