import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Schemas from '/imports/api/schemas/schema'

const getData = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('all.schemas')
    const data = Schemas.find({}).fetch()
    return { data, isLoading: !subscription.ready() }
  }, [])

const SchemasContext = React.createContext({ getData })
export default SchemasContext

function SchemasContextProvider({ children }) {
  return <SchemasContext.Provider value={{ getData }}>{children}</SchemasContext.Provider>
}

export { SchemasContextProvider }
