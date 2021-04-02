import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { reactFormatter } from 'react-tabulator'
import MessageTemplates from '/imports/api/message-templates/schema'
import Workflows from '/imports/api/workflows/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import List from './list'

const debug = require('debug')('se:lister')
const idField = '_id'
let push
const dateFormat = {
  inputFormat: 'DD/MM/YY HH:mm',
  outputFormat: 'DD/MM/YY HH:mm',
  invalidPlaceholder: '',
}

const remove = (id) => meteorCall('rm.messageTemplates', 'Deleting', id)
const update = (form) => meteorCall('update.messageTemplates', 'updating', form)
const insert = (form) => meteorCall('insert.messageTemplates', 'adding', form)
const edit = (id) => push(`/admin/message-templates/view/${id}`)
const add = (defaultObject) => push(`/admin/message-templates/add`)
const view = (id) => push(`/admin/message-templates/edit/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    `Are you sure you want to archive this MessageTemplates and related entities?`
  )

  if (name && text) {
    meteorCall('archive.messageTemplates', `Archiving MessageTemplates to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, add, archive }

// Config data

const defaultObject = {
  name: 'Untitled',
  slug: 'untitled',
  type: 'SMS',
  body: 'Re: *|address|*\nNew message',
  subject: 'Your property',
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

  { field: 'revision', title: 'Rev', width: 60, formatter: null },
  { field: 'name', title: 'Name', editor: true, formatter: null },
  { field: 'slug', title: 'Slug', editor: true, formatter: null },
  {
    field: 'body',
    title: 'Body',
    editor: true,
    formatter: 'textarea',
    verticalNavigation: 'editor',
  },
  {
    field: 'updatedAt',
    title: 'Updated',
    editor: true,
    formatter: 'datetime',
    formatterParams: dateFormat,
    sorter: 'date',
    sorterParams: { format: 'YYYY-MM-DD HH:mm' },
  },
  { field: 'type', title: 'Type', formatter: null },
  { field: 'uses', title: 'Uses', formatter: 'textarea' },
]
const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
const MessageTemplatesLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.messageTemplates.uses')
  const refs = {}
  Workflows.find({ slug: /^vic/ }).forEach((wf) => {
    wf.stages.forEach((stg) => {
      stg.steps.forEach((step) => {
        step.notifications?.forEach((notif, ix) => {
          const slugPath = [wf.slug, stg.slug, step.slug].join('/')
          if (notif.text?.length > 15) {
            debug(`naked notification text in ${slugPath}: [notif.text]`)
          } else {
            if (!refs[notif.text]) refs[notif.text] = []

            refs[notif.text].push(slugPath)
          }
        })
      })
    })
  })
  const items = MessageTemplates.find({}).map((row) => {
    row.uses = refs[row.slug]?.join('\n')
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

export default MessageTemplatesLister
