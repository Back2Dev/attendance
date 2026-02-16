import { Meteor } from 'meteor/meteor'
import { meteorCall } from '/imports/ui/utils/meteor'
import { Random } from 'meteor/random'
import { withTracker, useTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Settings from '/imports/api/settings/schema'
import List from './list'

const debug = require('debug')('app:lister')

// these methods are normally in the methods.sql.js file so they don't exist
const remove = (id) => meteorCall('rm.settings', 'Deleting', id)
const update = (form) => meteorCall('update.settings', 'updating', form)
const insert = (form) => meteorCall('insert.settings', 'adding', form)

// Config data

const defaultObject = {
  name: 'Untitled',
  type: 'string',
  key: 'new-key',
  value: 'value',
}

const columns = [
  {
    formatter: 'rowSelection',
    hozAlign: 'center',
    headerSort: false,
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    },
  },
  { field: 'name', title: 'name', editor: true, formatter: null },
  { field: 'key', title: 'key', editor: true, formatter: null },
  { field: 'value', title: 'value', editor: true, formatter: null },
  { field: 'type', title: 'type', editor: true, formatter: null },
]
const Loading = (props) => {
  if (props.loading) return <div>Loading settings...</div>
  return <List {...props}></List>
}

const Live = () => {
  const { items, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('all.settings')
    const items = Settings.find({}).fetch()
    return { items, loading: !subsHandle.ready() }
  }, [])

  if (loading) return <div>Loading settings...</div>
  const props = { items, remove, update, insert, columns, defaultObject, loading }

  return <List {...props}></List>
}

const Lister = () => {
  const [loading, setLoading] = React.useState(true)
  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await meteorCall('fetch.settings')
      setRows(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const props = { items: rows, remove, update, insert, columns, defaultObject, loading }
  debug('props', props)
  if (loading) return <div>Loading settings...</div>
  return <List {...props}></List>
}

export default Live
