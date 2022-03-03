import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { reactFormatter } from 'react-tabulator'
import StandupNotes from '/imports/api/standup-notes/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import Loader from '/imports/ui/components/commons/loading.js'
import StandupNotesList from './list'
import config from './config'

const debug = require('debug')('app:lister')
const idField = '_id'
let push
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const remove = (id) => meteorCall('rm.standupNotes', 'Deleting', id)
const update = (form) => meteorCall('update.standupNotes', 'updating', form)
const insert = (form) => meteorCall('insert.standupNotes', 'adding', form)
const add = () => push(`/admin/standup-notes/add`)
const edit = (id) => push(`/admin/standup-notes/edit/${id}`)
const view = (id) => push(`/admin/standup-notes/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    `Are you sure you want to archive this StandupNotes and related entities?`
  )

  if (name && text) {
    meteorCall('archive.standupNotes', `Archiving StandupNotes to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, add, archive }

// Config data

const editIcon = (cell, formatterParams) => {
  //plain text value
  return "<i class='fa fa-edit'></i>"
}
const viewIcon = (cell, formatterParams) => {
  //plain text value
  return "<i class='fa fa-eye'></i>"
}

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
    formatter: reactFormatter(<Eye />),
    headerSort: false,
    width: 25,
    hozAlign: 'center',
    cellClick: (e, cell) => {
      const id = cell.getData()[idField]
      if (!id) alert(`Could not get id from [${idField}]`)
      else methods.view(id)
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

const StandupNotesWrapper = (props) => {
  push = useHistory()?.push
  if (props.loading) return <Loader loading />
  return <StandupNotesList {...props}></StandupNotesList>
}

const StandupNotesLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.standupNotes')
  const items = StandupNotes.find({}).map((row) => {
    row.search = obj2Search(row)
    return row
  })
  const columns = stdCols.concat(config.list.columns)
  return {
    items,
    methods,
    columns,
    loading: !subsHandle.ready(),
  }
})(StandupNotesWrapper)

export default StandupNotesLister
