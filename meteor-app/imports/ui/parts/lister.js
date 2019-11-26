import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Parts from '/imports/api/parts/schema'
import List from './list'

const remove = id => Meteor.call('rm.Parts', id)
const update = form => Meteor.call('update.Parts', form)
const insert = form => Meteor.call('add.Parts', form)

const defaultObject = {
  name: 'Untitled',
  active: false
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
  { field: 'retailPrice', title: 'Retail Price(ct)', editor: true },
  { field: 'wholesalePrice', title: 'Wholesale Price(ct)', editor: true },
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
