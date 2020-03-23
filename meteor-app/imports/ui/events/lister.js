import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { Loader } from 'semantic-ui-react'
import Events, { defaultObject } from '/imports/api/events/schema'
import List from './list'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import CONSTANTS from '/imports/api/constants'
import { dollarInput } from '/imports/ui/utils/editors'

const remove = id => Meteor.call('rm.Events', id)
const update = form => {
  form.days = CONSTANTS.DAYS_WEEK.map(day => {
    return form[`day${day.id}`] ? day.id : null
  }).filter(day => day !== null)
  Meteor.call('update.Events', form)
}
const add = form => Meteor.call('add.Events', form)

const columns = [
  {
    formatter: 'rowSelection',
    titleFormatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'name', title: 'Name', editor: true, validator: 'required' },
  { field: 'description', title: 'Description', editor: true },
  { field: 'location', title: 'Location', editor: true },
  {
    field: 'when',
    title: 'When',
    editor: DateEditor,
    width: 110
  },
  { field: 'active', title: 'Active', formatter: 'tickCross', editor: true, align: 'center' },
  {
    field: 'duration',
    title: 'Duration(h)',
    editor: true,
    validator: ['required', 'integer']
  },
  {
    field: 'price',
    title: 'Price',
    editor: dollarInput,
    mutatorEdit: value => Math.round(value * 100),
    formatter: cell =>
      (cell.getValue() / 100).toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD'
      })
  },
  {
    field: 'type',
    title: 'Type',
    editor: 'select',
    editorParams: {
      allowEmpty: true,
      showListOnEmpty: true,
      values: {
        day: 'day',
        once: 'once',
        monthly: 'monthly'
      }
    }
  }
]

CONSTANTS.DAYS_WEEK.forEach(day => {
  columns.push({
    field: `day${day.id}`,
    title: day.value,
    headerVertical: 'flip',
    formatter: 'tickCross',
    editor: true,
    align: 'center',
    width: 40
  })
})

const Loading = props => {
  if (props.loading)
    return (
      <Loader active inline="centered" size="massive">
        Loading
      </Loader>
    )
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
