import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Settings from '/imports/api/settings/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'

const remove = id => meteorCall('rm.settings', 'Deleting', id)
const update = form => meteorCall('update.settings', 'updating', form)
const insert = form => meteorCall('insert.settings', 'adding', form)

// Config data

const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX'
}
const columns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'name', title: 'name', editor: true },
  { field: 'type', title: 'type', editor: true },
  { field: 'key', title: 'key', editor: true },
  { field: 'value', title: 'value', editor: true }
]
const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.settings')
  return {
    items: Settings.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
