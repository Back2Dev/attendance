import React from 'react'
import PropTypes from 'prop-types'
import MuiGrid from '/imports/ui/components/commons/mui-grid'
import { TabAppbar } from '/imports/ui/utils/generic'

const debug = require('debug')('app:add')

const idField = '_id'
const List = ({ items, update, remove, insert, columns, defaultObject, loading }) => {

  const tableRef = React.useRef(null)

  const downloadCSV = () => {
    tableRef.current.table.download('csv', 'Settings.csv')
  }
  const addANewRow = () => {
    insert(defaultObject)
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
    await update(data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 20,
    downloadReady: (fileContents, blob) => blob,
  }
  if (idField === 'id') tableOptions.reactiveData = true
  const deleteRows = () => {
    const selectedIds = tableRef.current?.table?.getSelectedIds?.() || []
    if (selectedIds.length === 0) {
      alert('Please select one or more items to delete')
      return
    }
    selectedIds.forEach((id) => remove(id))
  }

  const addNotification = () => {}

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!items || !items.length) {
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
