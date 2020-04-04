import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css'
import { ReactTabulator } from 'react-tabulator'
import './styles.css'
const debug = require('debug')('b2b:reminders')

const CartList = ({ carts, columns, remove, reconcile }) => {
  const [rows, setRows] = React.useState(carts)
  const [rowsSelected, setRowsSelected] = React.useState([])

  React.useEffect(() => {
    setRows(carts)
    setRowsSelected([])
  }, [carts])

  const tableRef = React.useRef(null)

  const tableOptions = {
    layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 20,
    rowClick: function(e, row) {
      //e - the click event object
      //row - row component
      row.toggleSelect() //toggle row selected state on row click
    },
    rowSelected: function(row) {
      if (!rowsSelected.includes(row._row.data._id)) {
        setRowsSelected(ids => ids.concat(row._row.data._id))
      }
    },
    rowDeselected: function(row) {
      setRowsSelected(rowsSelected.filter(id => id !== row._row.data._id))
    }
  }
  const deleteRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to delete')
    else {
      setRowsSelected(ids => {
        ids.forEach(id => remove(id))
        return []
      })
      // if (tableRef) tableRef.current.table.deselectRow()
    }
  }
  const reconcileRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to reconcile')
    else {
      debug('reconciling', rowsSelected)
      setRowsSelected(ids => {
        ids.forEach(id => reconcile(id))
        return []
      })
      // Clear the table selections
      if (tableRef) tableRef.current.table.deselectRow()
    }
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
      <ReactTabulator ref={tableRef} columns={columns} data={rows} options={tableOptions} />
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
