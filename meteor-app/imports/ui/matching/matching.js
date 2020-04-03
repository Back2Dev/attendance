import React from 'react'
import PropTypes from 'prop-types'
import { Button, Menu, Checkbox, Tab, Icon, Table, Segment } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css'
import { ReactTabulator } from 'react-tabulator'
import Alert from '/imports/ui/utils/alert'
import './styles.css'
import Cart from '../shop/cart-summary'
const debug = require('debug')('b2b:reminders')

const CartList = ({ carts, status, columns, remove, reconcile }) => {
  const [filters, setFilters] = React.useState(status ? { status } : {})
  const newCarts = carts
  const [rowsSelected, setRowsSelected] = React.useState([])
  const [rows, setRows] = React.useState(newCarts)

  React.useEffect(() => {
    setRows(newCarts)
    // setRowsSelected([])
  })

  const tableOptions = {
    layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 20,
    rowSelected: function(row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
      debug('selected', rowsSelected)
    },
    rowDeselected: function(row) {
      for (let i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data._id) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    }
  }
  const deleteRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to delete')
    rowsSelected.forEach(id => remove(id))
  }
  const reconcileRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to reconcile')
    rowsSelected.forEach(id => reconcile(id))
  }
  const buttons = [
    { action: reconcileRows, id: 'reconcile', caption: 'Reconcile', color: 'green' },
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'red' }
  ]

  return (
    <>
      <Segment>
        Shopping carts
        <span style={{ float: 'right', right: '0px' }}>
          {buttons.map(btn => (
            <Button id={btn.id} key={btn.id} size="mini" onClick={btn.action} color={btn.color} type="button">
              {btn.caption}
            </Button>
          ))}
        </span>
      </Segment>
      <ReactTabulator columns={columns} data={rows} options={tableOptions} />
    </>
  )
}

CartList.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  reconcile: PropTypes.func.isRequired,
  purchases: PropTypes.array.isRequired
}

export default CartList
