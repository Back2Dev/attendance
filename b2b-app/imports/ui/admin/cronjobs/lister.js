import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import { reactFormatter } from '/imports/ui/components/commons/mui-grid'
import Cronjobs from '/imports/api/cronjobs/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@mui/icons-material/Visibility'
import PencilSquare from '@mui/icons-material/Edit'
import List from './list'

const debug = require('debug')('app:cronjobs/lister')
const idField = '_id'
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const defaultObject = {
  name: 'untitled',
  frequency: '1 hour',
  type: 'unknown',
}

const columns = (methods) => [
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
    formatter: reactFormatter(<Eye />),
    headerSort: false,
    width: 25,
    hozAlign: 'center',
    cellClick: (e, cell) => {
      const id = cell.getData()[idField]
      if (!id) alert(`Could not get id from [${idField}]`)
      else methods.edit(id)
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
      else methods.view(id)
    },
  },

  { field: 'name', title: 'name', editor: true, formatter: null },
  { field: 'frequency', title: 'frequency', editor: true, formatter: null },
  { field: 'type', title: 'type', editor: true, formatter: null },
  { field: 'status', title: 'Status', editor: true, formatter: null },
  {
    field: 'active',
    title: 'Active',
    editor: true,
    formatter: 'tickCross',
    hozAlign: 'center',
  },
  {
    field: 'lastRun',
    title: 'lastRun',
    formatter: 'datetime',
    formatterParams: { outputFormat: 'HH:mm:ss' },
  },
  {
    field: 'nextRun',
    title: 'nextRun',
    formatter: 'datetime',
    formatterParams: { outputFormat: 'HH:mm:ss' },
  },
]

const CronjobsLister = () => {
  const navigate = useNavigate()

  const methods = useMemo(() => {
    const edit = (id) => navigate(`/admin/cronjobs/edit/${id}`)
    const view = (id) => navigate(`/admin/cronjobs/view/${id}`)
    const archive = async (rowids) => {
      const name = prompt('Please enter a name for the archive')
      const text = confirm(`Are you sure you want to archive this Cronjobs and related entities?`)
      if (name && text) {
        meteorCall('archive.cronjobs', `Archiving Cronjobs to ${name}`, {
          name,
          ids: rowids,
        })
      }
    }
    return {
      remove: (id) => meteorCall('rm.cronjobs', 'Deleting', id),
      update: (form) => meteorCall('update.cronjobs', 'updating', form),
      insert: (form) => meteorCall('insert.cronjobs', 'adding', form),
      edit,
      view,
      archive,
    }
  }, [navigate])

  const { items, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('all.cronjobs')
    const items = Cronjobs.find({}).map((row) => ({ ...row, search: obj2Search(row) }))
    return { items, loading: !subsHandle.ready() }
  }, [])

  if (loading) return <div>Loading...</div>
  return (
    <List items={items} methods={methods} columns={columns(methods)} defaultObject={defaultObject} loading={loading} />
  )
}

export default CronjobsLister
