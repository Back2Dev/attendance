import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { reactFormatter } from '/imports/ui/components/commons/mui-grid'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import PencilSquare from '@mui/icons-material/Edit'
import EventsList from './list'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:setup:lister')
const idField = '_id'
let push

const remove = (id) => meteorCall('rm.events', 'Deleting', { id })
const update = (form) => meteorCall('update.events', 'updating', { form })
const insert = (form) => meteorCall('insert.events', 'adding', { form })
const add = () => push(`/setup/events/add`)
const edit = (id) => push(`/setup/events/edit/${id}`)
const view = (id) => push(`/setup/events/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(`Are you sure you want to archive this Events and related entities?`)
  if (name && text) {
    meteorCall('archive.events', `Archiving Events to ${name}`, { name, ids: rowids })
  }
}
const methods = { remove, update, insert, view, edit, add, archive }

const stdCols = [
  {
    formatter: 'rowSelection',
    width: 25,
    hozAlign: 'center',
    headerSort: false,
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    },
  },
  {
    formatter: reactFormatter(<PencilSquare />),
    width: 25,
    headerSort: false,
    hozAlign: 'center',
    cellClick: (e, cell) => {
      const id = cell.getData()[idField]
      if (!id) alert(`Could not get id from [${idField}]`)
      else methods.edit(id)
    },
  },
]

const EventsLister = (props) => {
  push = useHistory()?.push
  const { items, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('all.events')
    const items = Events.find({}).map((row) => {
      row.search = obj2Search(row)
      return row
    })
    return { items, loading: !subsHandle.ready() }
  }, [])

  const columns = stdCols.concat(config.list.columns)

  if (loading) return <div>Loading...</div>
  return <EventsList {...props} items={items} loading={loading} methods={methods} columns={columns} />
}

export default EventsLister
