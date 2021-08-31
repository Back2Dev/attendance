import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Surveys from '/imports/api/surveys/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import { reactFormatter } from 'react-tabulator'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import List from './list'

const debug = require('debug')('app:lister')
const idField = '_id'
let history
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const remove = (id) => meteorCall('rm.surveys', 'Deleting', id)
const update = (form) => meteorCall('update.surveys', 'updating', form)
const insert = (form) => meteorCall('insert.surveys', 'adding', form)
const edit = (id) => history.push(`/admin/surveys/edit/${id}`)
const view = (id) => history.push(`/admin/surveys/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    `Are you sure you want to archive this Surveys and related entities?`
  )

  if (name && text) {
    meteorCall('archive.surveys', `Archiving Surveys to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, archive }

// Config data

const defaultObject = {
  name: 'Untitled',
  slug: 'untitled',
  steps: [],
  primary: [],
  version: '1',
  active: true,
}
const editIcon = (cell, formatterParams) => {
  //plain text value
  return "<i class='fa fa-edit'></i>"
}
const viewIcon = (cell, formatterParams) => {
  //plain text value
  return "<i class='fa fa-eye'></i>"
}

const columns = [
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

  { field: 'name', title: 'Name', editor: true, formatter: null },
  { field: 'slug', title: 'Slug', editor: true, formatter: null },
  { field: 'version', title: 'version', editor: true },
  {
    field: 'active',
    title: 'active',
    editor: true,
    formatter: 'tickCross',
    hozAlign: 'center',
  },
]
const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
const SurveysLister = withTracker((props) => {
  history = props.history
  const subsHandle = Meteor.subscribe('all.surveys')
  const items = Surveys.find({}).map((row) => {
    row.search = obj2Search(row)
    return row
  })

  return {
    items,
    methods,
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
      const { status, data } = await meteorCall('fetch.surveys')
      setRows(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const props = { items: rows, methods, columns, defaultObject, loading }
  debug('props', props)
  if (loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default idField === 'id' ? Lister : SurveysLister
