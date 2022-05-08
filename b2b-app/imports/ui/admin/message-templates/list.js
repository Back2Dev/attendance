import React from 'react'
import PropTypes from 'prop-types'
import { Box, Container } from '@material-ui/core'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator } from 'react-tabulator'
import { TabAppbar } from '/imports/ui/utils/generic'

const debug = require('debug')('app:add')

const idField = '_id'
const FILTER_NAME = 'app:message-templates:filter'

const List = ({ items, methods, columns, defaultObject, loading }) => {
  const [rowsSelected, setRowsSelected] = React.useState([])

  const tableRef = React.useRef(null)

  const downloadCSV = () => {
    if (!tableRef || !tableRef.current) {
      alert('I have no data for you to download yet')
      return null
    }

    tableRef.current.table.download('csv', 'MessageTemplates.csv')
  }

  const onCellEdited = (cell) => {
    debug('cellEdited', cell)
    methods.update(cell._cell.row.data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    // layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 12,
    persistence: {
      sort: true,
      filter: true,
      columns: true,
    },
    persistenceID: 'app:message-templates',
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
    rowDblClick: function (e, row) {
      //e - the click event object
      //row - row component
      methods.view(row._row.data[idField])
    },
  }
  if (idField === 'id') tableOptions.reactiveData = true
  const deleteRows = () => {
    if (rowsSelected.length === 0) alert('Please select one or more items to delete')
    rowsSelected.forEach((id) => methods.remove(id))
    if (idField === 'id') {
      // Latency compensation for non-reactive database
      const newRows = items.filter((row) => !rowsSelected.includes(row[idField]))
      setRows(newRows)
      setRowsSelected([])
    }
  }

  const addANewRow = () => {
    methods.add(defaultObject)
  }

  const archiveData = () => {
    console.log(rowsSelected)
    if (rowsSelected.length === 0) alert('Please select one or more items to Archive')
    methods.archive(rowsSelected)
  }

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!items.length) {
      Contents = () => <span>No data found</span>
    } else {
      Contents = () => (
        <ReactTabulator
          ref={tableRef}
          columns={columns}
          data={items}
          options={tableOptions}
          cellEdited={onCellEdited}
        />
      )
    }
  }
  const searchChange = (e) => {
    if (!tableRef || !tableRef.current) {
      alert('I have no data for you to search yet')
      return null
    }
    tableRef.current.table.setFilter('search', 'like', e.target.value)
    localStorage.setItem(FILTER_NAME, e.target.value)
  }

  const buttons = [
    { action: downloadCSV, id: 'csv', caption: 'Download CSV', color: 'primary' },
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'secondary' },
    { action: addANewRow, id: 'add', caption: 'Add', color: 'primary' },
    { action: archiveData, id: 'archive', caption: 'Archive', color: 'secondary' },
  ]

  return (
    <Container>
      <Box my={7}>
        <TabAppbar
          title="Message templates"
          buttons={buttons}
          search={true}
          onChange={searchChange}
          defaultValue={localStorage.getItem(FILTER_NAME)}
        />
        <Contents />
      </Box>
    </Container>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  methods: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  defaultObject: PropTypes.object.isRequired,
}
export default List
