// data layer
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { useTracker } from 'meteor/react-meteor-data'
import { meteorCall } from '/imports/ui/utils/meteor'
import React from 'react'
import Collections from '/imports/api/collections/schema'
import Loader from '/imports/ui/components/commons/loading.js'
import List from './list'
import getCollection from './collections'
const debug = require('debug')('app:dba')

const getData = ({ collection, view }) =>
  useTracker(() => {
    const subscription = Meteor.subscribe('name.collections', { name: collection })
    const c = Collections.findOne({ name: collection })
    const columns = c?.columns || [
      { field: 'name' },
      { field: 'active', type: 'boolean' },
    ]
    debug({ columns })
    const rawC = getCollection(collection)
    debug(`Subscribing to all.${collection}`, rawC)
    const data = (collection && rawC?.find({}).fetch()) || []
    return { data, isLoading: !subscription.ready(), columns }
  }, [])

const Lister = ({ collection, view }) => {
  const { data, isLoading, columns } = getData({ collection, view })

  const methods = {
    update: (row) => {
      meteorCall(`update.${collection}`, null, row)
    },
    remove: (rows) => {
      Array.from(rows).forEach((row) => {
        meteorCall(`rm.${collection}`, null, row)
      })
    },
    insert: (form) => {
      meteorCall(`insert.${collection}`, null, form)
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
    columns,
  }

  return <List {...editProps} />
}

export default Lister
