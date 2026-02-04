import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Events, { defaultObject } from '/imports/api/events/schema'
import List from './list'
import CONSTANTS from '/imports/api/constants'
import moment from 'moment'

const remove = id => Meteor.call('rm.Events', id)
const update = form => {
  form.days = CONSTANTS.DAYS_WEEK.map(day => {
    return form[`day${day.id}`] ? day.id : null
  }).filter(day => day !== null)
  Meteor.call('update.Events', form)
}
const add = form => Meteor.call('add.Events', form)

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, editable: true },
  { field: 'description', headerName: 'Description', flex: 1, editable: true },
  { field: 'location', headerName: 'Location', flex: 1, editable: true },
  {
    field: 'when',
    headerName: 'When',
    type: 'date',
    width: 140,
    editable: true,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY') : '')
  },
  { field: 'active', headerName: 'Active', type: 'boolean', width: 110, editable: true },
  {
    field: 'duration',
    headerName: 'Duration(h)',
    type: 'number',
    width: 140,
    editable: true
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 140,
    editable: true,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD'
      }),
    valueParser: (value) => Math.round(parseFloat(value || 0) * 100)
  },
  {
    field: 'type',
    headerName: 'Type',
    type: 'singleSelect',
    width: 120,
    editable: true,
    valueOptions: ['day', 'once', 'monthly']
  }
]

CONSTANTS.DAYS_WEEK.forEach(day => {
  columns.push({
    field: `day${day.id}`,
    title: day.value,
    type: 'boolean',
    headerName: day.value,
    editable: true,
    align: 'center',
    headerAlign: 'center',
    width: 90
  })
})

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.events')

  return {
    items: Events.find({})
      .fetch()
      .map(item => {
        const days = item.days || []
        days.forEach(dayNo => {
          item['day' + dayNo] = true
        })
        return item
      }),
    remove,
    update,
    add,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
