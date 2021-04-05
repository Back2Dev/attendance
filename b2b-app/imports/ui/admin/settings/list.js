import React from 'react'
import PropTypes from 'prop-types'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator } from 'react-tabulator'
import { TabAppbar } from '/imports/ui/utils/generic'

const debug = require('debug')('se:add')

const idField = '_id'
const List = ({ items, update, remove, insert, columns, defaultObject, loading }) => {
  const [rows, setRows] = React.useState(items)
  const [rowsSelected, setRowsSelected] = React.useState([])

  React.useEffect(() => {
    setRows(items)
    setRowsSelected([])
  }, [items])

  const tableRef = React.useRef(null)

  const downloadCSV = () => {
    tableRef.current.table.download('csv', 'Settings.csv')
  }
  const addANewRow = () => {
    insert(defaultObject)
  }

  const onCellEdited = (cell) => {
    debug('cellEdited', cell)
    update(cell._cell.row.data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 20,
    rowSelected: function (row) {
      rowsSelected.push(row._row.data[idField])
      setRowsSelected(rowsSelected)
    },
    rowDeselected: function (row) {
      for (let i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data[idField]) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    },

    downloadReady: (fileContents, blob) => blob,
  }
  if (idField === 'id') tableOptions.reactiveData = true
  const deleteRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to delete')
    rowsSelected.forEach((id) => remove(id))
    if (idField === 'id') {
      // Latency compensation for non-reactive database
      const newRows = rows.filter((row) => !rowsSelected.includes(row[idField]))
      setRows(newRows)
      setRowsSelected([])
    }
  }

  const addNotification = () => {}

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!rows || !rows.length) {
      Contents = () => <span>No data found</span>
    } else {
      Contents = () => (
        <ReactTabulator
          ref={tableRef}
          columns={columns}
          data={rows}
          options={tableOptions}
          cellEdited={onCellEdited}
        />
      )
    }
  }

  const buttons = [
    { action: downloadCSV, id: 'csv', caption: 'Download CSV', color: 'primary' },
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'secondary' },
    { action: addANewRow, id: 'add', caption: 'Add', color: 'primary' },
  ]
  return (
    <div>
      <TabAppbar title="Settings list" buttons={buttons} />
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
  defaultObject: PropTypes.object.isRequired,
}
export default List
