import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Schemas from '/imports/api/schemas/schema'
import PropTypes from 'prop-types'
import { meteorCall } from '/imports/ui/utils/meteor'

const methods = {
  // update: (row) => {
  //   meteorCall('update.schemas', null, row)
  // },
  remove: (rows, slug) => {
    Array.from(rows).forEach((row, callback) => {
      meteorCall('rm.schemas.collections', null, { id: row, collection: slug }).then(() =>
        callback()
      )
      console.log(row, slug)
    })
  },
  // insert: (form) => {
  //   meteorCall('insert.schemas', null, form)
  // },
}

const SchemasCollectionsContext = React.createContext({ methods })
export default SchemasCollectionsContext

function SchemasCollectionsContextProvider({ children }) {
  return (
    <SchemasCollectionsContext.Provider value={{ methods }}>
      {children}
    </SchemasCollectionsContext.Provider>
  )
}
SchemasCollectionsContextProvider.propTypes = {
  children: PropTypes.element,
}

export { SchemasCollectionsContextProvider }
