// data layer
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { meteorCall } from '/imports/ui/utils/meteor'
import React, { useContext } from 'react'
import Loader from '/imports/ui/components/commons/loading.js'
import List from './list'
import SchemasContext from './context'

const Lister = (props) => {
  const context = useContext(SchemasContext)
  const { data, isLoading } = context.getData()

  if (isLoading) return <Loader loading component="circular" />

  data.map((d) => {
    d.search = [d.name, d.slug].join(' ')
    return d
  })

  const editProps = {
    data,
    methods: context.methods,
  }

  return <List {...editProps} />
}

export default Lister