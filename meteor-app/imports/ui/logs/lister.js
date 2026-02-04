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
  { field: 'userId', headerName: 'userId', width: 160, editable: true },
  { field: 'memberId', headerName: 'memberId', width: 160, editable: true },
  { field: 'oId', headerName: 'oId', width: 160, editable: true },
  { field: 'status', headerName: 'status', width: 120, editable: true },
  { field: 'type', headerName: 'type', width: 120, editable: true },
  { field: 'description', headerName: 'description', flex: 1, editable: true },
  { field: 'eventTime', headerName: 'eventTime', width: 180, editable: false },
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
