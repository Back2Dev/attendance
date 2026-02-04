import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Settings from '/imports/api/settings/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'

const remove = (id) => meteorCall('rm.settings', 'Deleting', id)
const update = (form) =>
  meteorCall('update.settings', 'updating', form)
const insert = (form) => meteorCall('insert.settings', 'adding', form)

// Config data

const defaultObject = {
  name: 'My setting',
  type: 'string',
  key: 'XXX',
  value: '1',
}
const columns = [
  { field: 'name', headerName: 'name', flex: 1, editable: true },
  { field: 'type', headerName: 'type', width: 120, editable: true },
  { field: 'key', headerName: 'key', width: 160, editable: true },
  { field: 'value', headerName: 'value', flex: 1, editable: true },
]
const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker((props) => {
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
