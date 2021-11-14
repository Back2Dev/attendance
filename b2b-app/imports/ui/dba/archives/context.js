import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import getCollection from '/imports/api/collections/collections.js'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

export const ArchivesContext = React.createContext()

export const ArchivesProvider = ({ children, collectionName }) => {
  // const { children, collectionName, viewName } = props

  const [rows, setRows] = useState([])

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const getRows = () => {
    Meteor.call('collections.getArchives', { collectionName }, (error, result) => {
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
  }

  useEffect(() => {
    // build the filter
    console.log('calling collections.getArchives', collectionName)
    getRows()
  }, [collectionName])

  const restore = ({ selectedIds, keepTheCopy = false }) => {
    console.log('restore', selectedIds, keepTheCopy)
    Meteor.call(
      'collections.restore',
      {
        ids: selectedIds,
        keepTheCopy,
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

  const remove = ({ selectedIds }) => {
    console.log('remove', selectedIds)
    Meteor.call(
      'collections.removeArchives',
      {
        ids: selectedIds,
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
    <ArchivesContext.Provider
      value={{
        collectionName,
        rows,
        restore,
        remove,
      }}
    >
      {children}
    </ArchivesContext.Provider>
  )
}

ArchivesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  collectionName: PropTypes.string,
  viewName: PropTypes.string,
}

export const ArchivesConsumer = ArchivesContext.Consumer
