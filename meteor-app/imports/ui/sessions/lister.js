import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'
import moment from 'moment'

const remove = (id) => meteorCall('rm.sessions', 'Deleting', id)
const update = (form) =>
  meteorCall('update.sessions', 'Updating', form)
const add = (form) => meteorCall('add.sessions', 'Adding', form)

const columns = [
  {
    field: 'memberName',
    headerName: 'Member',
    flex: 1,
    renderCell: (params) => (
      <a href={params.row.url} target="_blank" rel="noreferrer">
        {params.value}
      </a>
    ),
  },
  { field: 'name', headerName: 'Session Name', flex: 1 },
  {
    field: 'timeIn',
    headerName: 'Start Time',
    type: 'dateTime',
    editable: true,
    width: 180,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY h:mm A') : '')
  },
  {
    field: 'timeOut',
    headerName: 'End Time',
    type: 'dateTime',
    editable: true,
    width: 180,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY h:mm A') : '')
  },
  { field: 'duration', headerName: 'Duration', type: 'number', width: 120, editable: true },
]

Session.set('filterDate', new Date())
const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker((props) => {
  const filterSubs = Meteor.subscribe(
    'memberSessions',
    Session.get('filterDate')
  )

  return {
    items: Sessions.find({})
      .fetch()
      .map((item) => {
        item.url = `/admin/userprofiles/${item.memberId}`
        return item
      }),
    members: Members.find({}).fetch(),
    events: Events.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    loading: !filterSubs.ready(),
  }
})(Loading)
