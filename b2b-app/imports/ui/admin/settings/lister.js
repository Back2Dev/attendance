import { Meteor } from 'meteor/meteor'
import { meteorCall } from '/imports/ui/utils/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Settings from '/imports/api/settings/schema'
import List from './list'

const debug = require('debug')('se:lister')

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
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
const Tracker = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.settings')
  return {
    items: Settings.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready(),
  }
})(Loading)

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
  if (loading) return <div>Loading...</div>
  return <List {...props}></List>
}

// export default Lister // Use this for SQL DB
export default Tracker // Use this for Mongo (reactive)
