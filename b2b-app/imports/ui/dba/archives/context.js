import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import getCollection from '/imports/api/collections/binder'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts'

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

  const getRows = async () => {
    try {
      const result = await Meteor.callAsync('collections.getArchives', { collectionName })
      if (result?.status === 'failed') {
        showError(result.message)
        return
      }
      setRows(result.rows)
    } catch (error) {
      showError(error.message)
    }
  }

  useEffect(() => {
    // build the filter
    console.log('calling collections.getArchives', collectionName)
    getRows()
  }, [collectionName])

  const restore = async ({ selectedIds, keepTheCopy = false }) => {
    console.log('restore', selectedIds, keepTheCopy)
    try {
      const result = await Meteor.callAsync('collections.restore', {
        ids: selectedIds,
        keepTheCopy,
      })
      if (result?.status === 'failed') {
        showError(result?.message)
        return
      }
      if (result?.status === 'success') {
        showSuccess(result.message)
      }

      // reload data
      getRows()
    } catch (error) {
      showError(error.message)
    }
  }

  const remove = async ({ selectedIds }) => {
    console.log('remove', selectedIds)
    try {
      const result = await Meteor.callAsync('collections.removeArchives', {
        ids: selectedIds,
      })
      if (result?.status === 'failed') {
        showError(result?.message)
        return
      }
      if (result?.status === 'success') {
        showSuccess(result.message)
      }

      // reload data
      getRows()
    } catch (error) {
      showError(error.message)
    }
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
