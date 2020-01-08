import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Products from '/imports/api/products/schema'
import List from './list'

const remove = id => Meteor.call('rm.Products', id)
const update = form => Meteor.call('update.Products', form)
const insert = form => Meteor.call('insert.Products', form)

// Config data
const dollarInput = function number(cell, onRendered, success, cancel, editorParams) {
  var cellValue = cell.getValue(),
    vertNav = editorParams.verticalNavigation || 'editor',
    input = document.createElement('input')

  input.setAttribute('type', 'number')

  //create and style input
  input.style.padding = '4px'
  input.style.width = '100%'
  input.style.boxSizing = 'border-box'

  input.value = cellValue / 100

  var blurFunc = function blurFunc(e) {
    onChange()
  }

  onRendered(function() {
    //submit new value on blur
    input.removeEventListener('blur', blurFunc)

    input.focus()
    input.style.height = '100%'

    //submit new value on blur
    input.addEventListener('blur', blurFunc)
  })

  function onChange() {
    var value = input.value

    if (!isNaN(value) && value !== '') {
      value = Number(value)
    }

    if (value != cellValue) {
      if (success(value)) {
        cellValue = value //persist value if successfully validated incase editor is used as header filter
      }
    } else {
      cancel()
    }
  }

  //submit new value on enter
  input.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 13:
        // case 9:
        onChange()
        break

      case 27:
        cancel()
        break

      case 38: //up arrow
      case 40:
        //down arrow
        if (vertNav == 'editor') {
          e.stopImmediatePropagation()
          e.stopPropagation()
        }
        break
    }
  })

  return input
}

const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX',
  type: 'membership',
  active: true
}

const typeOptions = {
  pass: 'Pass',
  membership: 'Membership',
  course: 'Course'
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
  { field: 'name', title: 'Name', editor: true, validator: 'required' },
  { field: 'description', title: 'Description', editor: true },
  { field: 'code', title: 'Code', editor: true },
  {
    field: 'type',
    title: 'Type',
    editor: 'select',
    editorParams: {
      allowEmpty: true,
      showListOnEmpty: true,
      values: typeOptions
    }
  },
  { field: 'subsType', title: 'Subs type', editor: true },
  { field: 'duration', title: 'Duration(months)', editor: true, validator: ['integer'] },
  {
    field: 'price',
    title: 'Price',
    editor: dollarInput,
    mutatorEdit: value => value * 100,
    formatter: cell => (cell.getValue() / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  { field: 'qty', title: 'Qty', editor: true, validator: ['required', 'integer'] },
  { field: 'image', title: 'Image', editor: true },
  { field: 'active', title: 'Active', editor: true, formatter: 'tickCross', align: 'center' },
  { field: 'autoRenew', title: 'Auto renew', editor: true, formatter: 'tickCross', align: 'center' },
  { field: 'startDate', title: 'Start date', editor: DateEditor },
  { field: 'endDate', title: 'End date', editor: DateEditor }
]

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.products')
  return {
    items: Products.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready(),
    columns,
    defaultObject
  }
})(Loading)
