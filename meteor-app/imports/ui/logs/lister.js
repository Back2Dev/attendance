import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import Logs from '/imports/api/logs/schema'
import List from './list'

const meteorCall = async (method, description, param) => {
  try {
    Alert.info(description || `Calling ${method}`)
    const s = await Meteor.callAsync(method, param)
    if (s.status === 'success') {
      Alert.success(s.message)
    } else {
      Alert.error(`Error ${s.message}`)
    }
  } catch (e) {
    Alert.error(`Error ${e.message}`)
  }
}

const remove = (id) => meteorCall('rm.logs', 'Deleting', id)
const update = (form) => meteorCall('update.logs', 'updating', form)
const insert = (form) => meteorCall('insert.logs', 'adding', form)

// Config data

const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX',
  type: 'unknown',
}
const columns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    },
  },
  { field: 'userId', title: 'userId', editor: true },
  { field: 'memberId', title: 'memberId', editor: true },
  { field: 'oId', title: 'oId', editor: true },
  { field: 'status', title: 'status', editor: true },
  { field: 'type', title: 'type', editor: true },
  { field: 'description', title: 'description', editor: true },
]
const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.logs')
  return {
    items: Logs.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready(),
  }
})(Loading)
