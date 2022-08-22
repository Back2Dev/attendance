import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { reactFormatter } from 'react-tabulator'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import ServiceItems from '/imports/api/service-items/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import ServiceItemsList from './list'
import config from './config'

const debug = require('debug')('app:lister')

const idField = '_id'
let push

const remove = (id) => meteorCall('rm.serviceItems', 'Deleting', id)
const update = (form) => meteorCall('update.serviceItems', 'updating', form)
const insert = (form) => meteorCall('insert.serviceItems', 'adding', form)
const add = () => push('/admin/service-items/add')
const edit = (id) => push(`/admin/service-items/edit/${id}`)
const view = (id) => push(`/admin/service-items/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    'Are you sure you want to archive this ServiceItems and related entities?'
  )

  if (name && text) {
    meteorCall('archive.serviceItems', `Archiving ServiceItems to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, add, archive }

// Config data

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
      if (!id) alert(`Could not get id  from [${idField}]`)
      else methods.edit(id)
    },
  },
]

const ServiceItemsWrapper = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <ServiceItemsList {...props}></ServiceItemsList>
}

const ServiceItemsLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.serviceItems')
  const items = ServiceItems.find({}).map((row) => {
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
})(ServiceItemsWrapper)

export default ServiceItemsLister
