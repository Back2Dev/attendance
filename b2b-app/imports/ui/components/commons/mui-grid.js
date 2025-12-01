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
const MuiGrid = forwardRef(function MuiGrid({ columns = [], data = [], options = {}, cellEdited }, ref) {
  const [filter, setFilter] = useState('')
  const [selectionModel, setSelectionModel] = useState([])

  const rows = useMemo(() => {
    if (!filter) return data
    const term = String(filter).toLowerCase()
    return data.filter((row) => String(row.search || '').toLowerCase().includes(term))
  }, [data, filter])

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

  const notifySelectionChanges = (newSelection) => {
    const toId = (row) => row?._id ?? row?.id
    const added = newSelection.filter((id) => !selectionModel.includes(id))
    const removed = selectionModel.filter((id) => !newSelection.includes(id))

    added.forEach((id) => {
      const row = rows.find((r) => toId(r) === id)
      if (row && options.rowSelected) {
        options.rowSelected({ _row: { data: row } })
      }
    })

    removed.forEach((id) => {
      const row = rows.find((r) => toId(r) === id)
      if (row && options.rowDeselected) {
        options.rowDeselected({ _row: { data: row } })
      }
    })

    setSelectionModel(newSelection)
  }

  const onCellEditCommit = (params) => {
    const rowData = rows.find((r) => (r._id ?? r.id) === params.id)
    const updated = { ...rowData, [params.field]: params.value }
    const fn = options.cellEdited || cellEdited
    if (fn) {
      fn({ _cell: { row: { data: updated } } })
    }
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
    },
  }))

  return (
    <div style={{ width: '100%', height: 600 }}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={(row) => row._id ?? row.id}
        checkboxSelection
        disableRowSelectionOnClick
        onRowDoubleClick={onRowDoubleClick}
        onCellEditCommit={onCellEditCommit}
        onSelectionModelChange={notifySelectionChanges}
        selectionModel={selectionModel}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </div>
  )
})

export default MuiGrid
export const reactFormatter = (node) => ({ __reactFormatter: true, node })
