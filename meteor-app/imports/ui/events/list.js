import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css'
import { ReactTabulator } from 'react-tabulator'

const debug = require('debug')('manx:add')

const List = ({ items, update, remove, add, columns, defaultObject, loading }) => {
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
    width: 100,
    rowSelected: function(row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
    },
    rowDeselected: function(row) {
      for (i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data._id) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    }
  }

  const deleteRows = () => {
    rowsSelected.forEach(id => remove(id))
  }

  const addANewRow = () => {
    add(defaultObject)
  }

  const Contents = () => {
    return !rows.length ? (
      <span>No data found</span>
    ) : (
      <ReactTabulator columns={columns} data={items} options={tableOptions} cellEdited={onCellEdited} />
    )
  }

  return (
    <div>
      <Segment>
        Events list
        <span style={{ float: 'right', right: '0px' }}>
          <Button size="mini" onClick={deleteRows} color="red" type="button">
            Delete
          </Button>
          <Button size="mini" onClick={addANewRow} color="black" type="button">
            Add
          </Button>
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
  add: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  defaultObject: PropTypes.object.isRequired
}
export default List
