import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Schemas from '/imports/api/schemas/schema'
import PropTypes from 'prop-types'
import { meteorCall } from '/imports/ui/utils/meteor'

const getData = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('all.schemas')
    const data = Schemas.find({}).fetch()
    return { data, isLoading: !subscription.ready() }
  }, [])

const methods = {
  update: (row) => {
    meteorCall('update.schemas', null, row)
  },
  remove: (rows) => {
    Array.from(rows).forEach((row) => {
      meteorCall('rm.schemas', null, row)
    })
  },
  insert: (form) => {
    meteorCall('insert.schemas', null, form)
  },
}

const SchemasContext = React.createContext({ getData, methods })
export default SchemasContext

function SchemasContextProvider({ children }) {
  return (
    <SchemasContext.Provider value={{ getData, methods }}>
      {children}
    </SchemasContext.Provider>
  )
}
SchemasContextProvider.propTypes = {
  children: PropTypes.element,
}

export { SchemasContextProvider }
