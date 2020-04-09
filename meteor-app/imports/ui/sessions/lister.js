import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'

const remove = id => meteorCall('rm.sessions', 'Deleting', id)
const update = form => meteorCall('update.sessions', 'Updating', form)
const add = form => meteorCall('add.sessions', 'Adding', form)

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: 'Invalid Date'
}

const columns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    width: 50,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  {
    field: 'url',
    title: 'Member',
    formatter: 'link',
    formatterParams: {
      labelField: 'memberName',
      target: '_blank'
    }
  },
  { field: 'name', title: 'Session Name' },
  {
    field: 'timeIn',
    title: 'Start Time',
    editor: DateEditor,
    formatter: 'datetime',
    formatterParams: dateFormat,
    sorter: 'date',
    sorterParams: {
      format: 'YYYY-MM-DD',
      alignEmptyValues: 'top'
    }
  },
  {
    field: 'timeOut',
    title: 'End Time',
    editor: DateEditor,
    formatter: 'datetime',
    formatterParams: dateFormat,
    sorter: 'date',
    sorterParams: {
      format: 'YYYY-MM-DD',
      alignEmptyValues: 'top'
    }
  },
  { field: 'duration', title: 'Duration', editor: true }
]

Session.set('filterDate', new Date())
const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker(props => {
  const filterSubs = Meteor.subscribe('memberSessions', Session.get('filterDate'))

  return {
    items: Sessions.find({})
      .fetch()
      .map(item => {
        item.url = `/admin/userprofiles/${item.memberId}`
        return item
      }),
    members: Members.find({}).fetch(),
    events: Events.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    loading: !filterSubs.ready()
  }
})(Loading)
