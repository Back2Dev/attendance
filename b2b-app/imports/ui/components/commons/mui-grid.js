import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'

const buildCsv = (columns, rows) => {
  const headers = columns.map((c) => `"${c.headerName.replace(/"/g, '""')}"`).join(',')
  const csvRows = rows.map((row) =>
    columns
      .map((c) => {
        const v = row[c.field]
        const cell = v === undefined || v === null ? '' : String(v)
        return `"${cell.replace(/"/g, '""')}"`
      })
      .join(',')
  )
  return [headers, ...csvRows].join('\n')
}

/**
 * Compatibility wrapper to replace react-tabulator with MUI DataGrid.
 * Only implements the subset of APIs used in this codebase.
 */
const MuiGrid = forwardRef(function MuiGrid(
  { columns = [], data = [], options = {}, cellEdited },
  ref
) {
  const [filter, setFilter] = useState('')
  const [selectionModel, setSelectionModel] = useState([])
  const [rowsState, setRowsState] = useState(data)

  // Keep local state in sync with upstream data (reactive Minimongo changes)
  React.useEffect(() => {
    setRowsState(data)
  }, [data])

  const rows = useMemo(() => {
    if (!filter) return rowsState
    const term = String(filter).toLowerCase()
    return rowsState.filter((row) => String(row.search || '').toLowerCase().includes(term))
  }, [rowsState, filter])

  const gridColumns = useMemo(() => {
    return columns
      .filter((c) => c.formatter !== 'rowSelection')
      .map((c) => {
        let renderCell
        if (c.formatter && c.formatter.__reactFormatter && c.cellClick) {
          renderCell = (params) => (
            <span
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              onClick={(e) =>
                c.cellClick(e, {
                  getData: () => params.row,
                  getValue: () => params.value,
                  _cell: { row: { data: params.row } },
                })
              }
            >
              {c.formatter.node}
            </span>
          )
        } else if (typeof c.formatter === 'function') {
          renderCell = (params) =>
            c.formatter({
              getData: () => params.row,
              getValue: () => params.value,
              _cell: { row: { data: params.row } },
            })
        }

        return {
          field: c.field,
          headerName: c.title || c.field,
          flex: c.width ? undefined : 1,
          width: c.width,
          align: c.hozAlign === 'center' ? 'center' : undefined,
          editable: !!c.editor,
          renderCell,
        }
      })
  }, [columns])

  const getId = (row) => row?._id ?? row?.id

  const notifySelectionChanges = (newSelection) => {
    const added = newSelection.filter((id) => !selectionModel.includes(id))
    const removed = selectionModel.filter((id) => !newSelection.includes(id))

    added.forEach((id) => {
      const row = rows.find((r) => getId(r) === id)
      if (row && options.rowSelected) {
        options.rowSelected({ _row: { data: row } })
      }
    })

    removed.forEach((id) => {
      const row = rows.find((r) => getId(r) === id)
      if (row && options.rowDeselected) {
        options.rowDeselected({ _row: { data: row } })
      }
    })

    setSelectionModel(newSelection)
  }

  const processRowUpdate = (newRow, oldRow) => {
    const fn = options.cellEdited || cellEdited
    if (fn) {
      fn({ _cell: { row: { data: newRow } } })
    }
    // Optimistically update local state so the grid reflects the change immediately
    setRowsState((prev) =>
      prev.map((row) => (getId(row) === getId(oldRow) ? { ...row, ...newRow } : row))
    )
    return newRow
  }

  const onRowDoubleClick = (params) => {
    if (options.rowDblClick) {
      options.rowDblClick(null, { _row: { data: params.row } })
    }
  }

  useImperativeHandle(ref, () => ({
    table: {
      setFilter: (_field, _operator, value) => setFilter(value || ''),
      download: (_type, filename = 'data.csv') => {
        const csv = buildCsv(gridColumns, rows)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      getSelectedIds: () => selectionModel,
    },
  }))

  return (
    <div style={{ width: '100%', height: 600 }}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={(row) => getId(row)}
        checkboxSelection
        disableRowSelectionOnClick
        onRowDoubleClick={onRowDoubleClick}
        processRowUpdate={processRowUpdate}
        // Support both legacy and current selection change props for compatibility
        onSelectionModelChange={notifySelectionChanges}
        onRowSelectionModelChange={notifySelectionChanges}
        rowSelectionModel={selectionModel}
        selectionModel={selectionModel}
        pageSizeOptions={[10, 25, 50]}
        editMode="cell"
        experimentalFeatures={{ newEditingApi: true }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </div>
  )
})

export default MuiGrid
export const reactFormatter = (node) => ({ __reactFormatter: true, node })
