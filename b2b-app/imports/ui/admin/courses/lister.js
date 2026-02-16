import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { reactFormatter } from '/imports/ui/components/commons/mui-grid'
import Courses from '/imports/api/courses/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@mui/icons-material/Visibility'
import PencilSquare from '@mui/icons-material/Edit'
import CoursesList from './list'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:lister')
const idField = '_id'
let push
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const remove = (id) => meteorCall('rm.courses', 'Deleting', id)
const update = (form) => meteorCall('update.courses', 'updating', form)
const insert = (form) => meteorCall('insert.courses', 'adding', form)
const add = () => push(`/admin/courses/add`)
const edit = (id) => push(`/admin/courses/edit/${id}`)
const view = (id) => push(`/admin/courses/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    `Are you sure you want to archive this Courses and related entities?`
  )

  if (name && text) {
    meteorCall('archive.courses', `Archiving Courses to ${name}`, {
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

const CoursesLister = (props) => {
  push = useHistory()?.push
  const { items, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('all.courses')
    const items = Courses.find({}).map((row) => {
      row.search = obj2Search(row)
      return row
    })
    return {
      items,
      loading: !subsHandle.ready(),
    }
  }, [])

  const columns = stdCols.concat(config.list.columns)

  if (loading) return <div>Loading...</div>

  return <CoursesList {...props} items={items} methods={methods} columns={columns} />
}

export default CoursesLister
