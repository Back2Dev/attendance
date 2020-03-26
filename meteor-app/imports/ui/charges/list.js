import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'

const debug = require('debug')('manx:add')

const List = ({ items, update, remove, insert, columns, defaultObject, loading }) => {
  const [rows, setRows] = React.useState(items)
  const [rowsSelected, setRowsSelected] = React.useState([])

  React.useEffect(() => {
    setRows(items)
    setRowsSelected([])
  }, [items])

  const onCellEdited = cell => {
    debug('cellEdited', cell)
    update(cell._cell.row.data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    layout: 'fitData',
    rowSelected: function(row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
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

  const addANewRow = () => {
    insert(defaultObject)
  }

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!rows.length) {
      Contents = () => <span>No data found</span>
    } else {
      Contents = () => <ReactTabulator columns={columns} data={rows} options={tableOptions} cellEdited={onCellEdited} />
    }
  }

  const buttons = [
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'red' },
    { action: addANewRow, id: 'add', caption: 'Add', color: 'black' }
  ]
  return (
    <div>
      <Segment>
        Charges list
        <span style={{ float: 'right', right: '0px' }}>
          {buttons.map(btn => (
            <Button id={btn.id} key={btn.id} size="mini" onClick={btn.action} color={btn.color} type="button">
              {btn.caption}
            </Button>
          ))}
        </span>
      </Segment>
      <Contents />
    </div>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  defaultObject: PropTypes.object.isRequired
}
export default List
