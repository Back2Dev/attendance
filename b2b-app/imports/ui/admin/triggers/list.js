import React from 'react'
import PropTypes from 'prop-types'
import MuiGrid from '/imports/ui/components/commons/mui-grid'
import { TabAppbar } from '/imports/ui/utils/generic'

const debug = require('debug')('app:add')

const idField = '_id'
const List = ({ items, methods, columns, defaultObject, loading }) => {
  const tableRef = React.useRef(null)

  const downloadCSV = () => {
    if (!tableRef || !tableRef.current) {
      alert('I have no data for you to download yet')
      return null
    }

    tableRef.current.table.download('csv', 'Triggers.csv')
  }

  const onCellEdited = async (cell) => {
    debug('cellEdited', cell)
    const data = { ...cell._cell.row.data }
    delete data.search
    if (!data._id && data.id) data._id = data.id
    if (!data._id) {
      alert('Unable to update: missing id')
      return
    }
    await methods.update(data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    // layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 10,
    downloadReady: (fileContents, blob) => blob,
    rowDblClick: function (e, row) {
      //e - the click event object
      //row - row component
      methods.view(row._row.data[idField])
    },
  }
  if (idField === 'id') tableOptions.reactiveData = true
  const deleteRows = () => {
    if (!tableRef.current?.table) {
      alert('Please select one or more items to delete')
      return
    }
    const selectedIds = tableRef.current.table.getSelectedIds?.() || []
    if (selectedIds.length === 0) alert('Please select one or more items to delete')
    selectedIds.forEach((id) => methods.remove(id))
  }

  const addANewRow = () => {
    methods.insert(defaultObject)
  }

  const archiveData = () => {
    if (!tableRef.current?.table) {
      alert('Please select one or more items to Archive')
      return
    }
    const selectedIds = tableRef.current.table.getSelectedIds?.() || []
    if (selectedIds.length === 0) alert('Please select one or more items to Archive')
    methods.archive(selectedIds)
  }

  if (!items.length) {
    Contents = () => <span>No data found</span>
  } else {
    Contents = () => (
      <MuiGrid
        ref={tableRef}
        columns={columns}
        data={items}
        options={tableOptions}
        cellEdited={onCellEdited}
      />
    )
  }
  const searchChange = (e) => {
    if (!tableRef || !tableRef.current) {
      alert('I have no data for you to search yet')
      return null
    }
    tableRef.current.table.setFilter('search', 'like', e.target.value)
  }

  const buttons = [
    { action: downloadCSV, id: 'csv', caption: 'Download CSV', color: 'primary' },
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'secondary' },
    { action: addANewRow, id: 'add', caption: 'Add', color: 'primary' },
    { action: archiveData, id: 'archive', caption: 'Archive', color: 'secondary' },
  ]
  return (
    <div>
      <TabAppbar title="" buttons={buttons} search={true} onChange={searchChange} />
      <Contents />
    </div>
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
