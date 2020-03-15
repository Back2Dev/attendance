import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Loader } from 'semantic-ui-react'
import ServiceItems from '/imports/api/service-items/schema'
import List from './list'
import { dollarInput } from '/imports/ui/utils/editors'

const remove = id => Meteor.call('rm.ServiceItems', id)
const insert = form => Meteor.call('add.ServiceItems', form)
const update = form => Meteor.call('update.ServiceItems', form)
// Config data

const defaultObject = {
  name: 'Untitled',
  price: 0,
  code: 'XXX',
  category: 'Category',
  used: false
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
  { field: 'name', title: 'Name', editor: true },
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
  { field: 'code', title: 'Code', editor: true },
  {
    field: 'category',
    title: 'Category',
    editor: true
  },
  { field: 'used', title: 'Used', formatter: 'tickCross', editor: true, align: 'center' }
]

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
  const subsHandle = Meteor.subscribe('all.serviceItems')
  return {
    items: ServiceItems.find({}).fetch(),
    remove,
    insert,
    update,
    loading: !subsHandle.ready(),
    defaultObject,
    columns
  }
})(Loading)
