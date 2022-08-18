// data layer
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { meteorCall } from '/imports/ui/utils/meteor'
import React from 'react'
import Loader from '/imports/ui/components/commons/loading.js'
import Schemas from '/imports/api/schemas/schema'
import List from './list'

const getData = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('all.schemas')
    const data = Schemas.find({}).fetch()
    return { data, isLoading: !subscription.ready() }
  }, [])

const Lister = (props) => {
  const { data, isLoading } = getData()

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
  if (isLoading) return <Loader loading component="circular" />

  data.map((d) => {
    d.search = [d.name, d.slug].join(' ')
    return d
  })

  const editProps = {
    data,
    methods,
  }

  return <List {...editProps} />
}

export default Lister
