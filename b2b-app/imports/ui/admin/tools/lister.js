import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { reactFormatter } from 'react-tabulator'
import Tools from '/imports/api/tools/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import ToolsList from './list'
import config from './config'

const debug = require('debug')('app:lister')
const idField = '_id'
let push
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const remove = (id) => meteorCall('rm.tools', 'Deleting', id)
const update = (form) => meteorCall('update.tools', 'updating', form)
const insert = (form) => meteorCall('insert.tools', 'adding', form)
const add = () => push(`/admin/tools/add`)
const edit = (id) => push(`/admin/tools/edit/${id}`)
const view = (id) => push(`/admin/tools/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    `Are you sure you want to archive this Tools and related entities?`
  )

  if (name && text) {
    meteorCall('archive.tools', `Archiving Tools to ${name}`, {
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

const ToolsWrapper = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <ToolsList {...props}></ToolsList>
}

const ToolsLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.tools')
  const items = Tools.find({}).map((row) => {
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
})(ToolsWrapper)

export default ToolsLister
