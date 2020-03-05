import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Events from '/imports/api/events/schema'
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

const remove = id => meteorCall('rm.sessions', 'Deleting', id)
const update = form => Meteor.call('update.sessions', form)
const add = form => Meteor.call('add.sessions', form)

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
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  {
    field: 'url', title: 'Member', formatter: 'link',
    formatterParams: {
      labelField: "memberName",
      target: "_blank",
    }
  },
  { field: 'name', title: 'Session Name' },
  { field: 'timeIn', title: 'Start Time', editor: DateEditor, formatter: 'datetime', formatterParams: dateFormat },
  { field: 'timeOut', title: 'End Time', editor: DateEditor, formatter: 'datetime', formatterParams: dateFormat },
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
    items: Sessions
      .find({})
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
