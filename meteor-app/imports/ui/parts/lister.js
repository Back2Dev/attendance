import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Parts from '/imports/api/parts/schema'
import List from './list'
import { dollarInput } from '/imports/ui/utils/editors'

const remove = id => Meteor.call('rm.Parts', id)
const update = form => Meteor.call('update.Parts', form)
const insert = form => Meteor.call('add.Parts', form)

const defaultObject = {
  imageUrl: 'Enter a URL',
  retailPrice: 0,
  wholesalePrice: 0,
  partNo: 0,
  name: 'Untitled'
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

  { field: 'partNo', title: 'Part No', editor: true },
  { field: 'name', title: 'Name', editor: 'input' },
  { field: 'status', title: 'Status', editor: true },
  { field: 'active', title: 'Active', formatter: 'tickCross', editor: true, align: 'center' },
  {
    field: 'retailPrice',
    title: 'Retail Price',
    editor: dollarInput,
    mutatorEdit: value => Math.round(value * 100),
    formatter: cell =>
      (cell.getValue() / 100).toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD'
      })
  },
  {
    field: 'wholesalePrice',
    title: 'Wholesale Price',
    editor: 'number',
    mutatorEdit: value => value * 100,
    formatter: cell => (cell.getValue() / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  { field: 'barcode', title: 'Barcode', editor: true },
  { field: 'imageUrl', title: 'Image Url', editor: true }
]

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.parts')
  return {
    items: Parts.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
