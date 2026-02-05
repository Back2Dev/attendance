import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Checkbox, TextField } from '@mui/material'

export const SelectColumn = { key: '__select__', type: 'select' }
export const SortColumn = {}

export const TextEditor = ({ row, column, onRowChange }) => {
  const value = row?.[column?.key] ?? ''
  return (
    <TextField
      variant="standard"
      size="small"
      autoFocus
      fullWidth
      value={value}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
    />
  )
}

export const SelectCellFormatter = ({ value, onChange, onClick }) => {
  return (
    <Checkbox
      checked={!!value}
      onChange={() => onChange(!value)}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick(e)
      }}
    />
  )
}

const buildCsv = (columns, rows) => {
  const headers = columns.map((c) => `"${(c.headerName || '').replace(/"/g, '""')}"`).join(',')
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

const MuiRdg = forwardRef(function MuiRdg(
  {
    columns = [],
    rows = [],
    rowKeyGetter = (row) => row?._id ?? row?.id,
    defaultColumnOptions = {},
    sortColumns,
    sortColumn,
    sortDirection,
    onSortColumnsChange,
    onSort,
    onRowsChange,
    onSelectedCellChange,
    selectedRows,
    onSelectedRowsChange,
    className,
    style,
    rowHeight,
    headerRowHeight,
    ...rest
  },
  ref
) {
  const hasCheckboxSelection =
    columns.some((c) => c === SelectColumn || c?.key === SelectColumn.key) || rest.checkboxSelection

  const baseColumns = columns.filter((c) => c !== SelectColumn && c?.key !== SelectColumn.key)

  const muiColumns = useMemo(() => {
    return baseColumns.map((col, idx) => {
      const editable = col.editable ?? col.editor != null ?? defaultColumnOptions.editable
      const sortable = col.sortable ?? defaultColumnOptions.sortable ?? true
      const renderCell =
        col.formatter &&
        ((params) =>
          col.formatter({
            row: params.row,
            column: col,
            rowIdx: params.rowIndex,
            onRowChange: (updatedRow) => {
              if (onRowsChange) {
                const id = rowKeyGetter(params.row)
                const newRows = rows.map((r) => (rowKeyGetter(r) === id ? updatedRow : r))
                onRowsChange(newRows)
              }
            },
            value: params.value,
          }))

      const renderEditCell =
        col.editor &&
        ((params) => {
          const EditorComp = col.editor
          return (
            <EditorComp
              row={params.row}
              column={col}
              onRowChange={(updatedRow) => {
                if (onRowsChange) {
                  const id = rowKeyGetter(params.row)
                  const newRows = rows.map((r) => (rowKeyGetter(r) === id ? updatedRow : r))
                  onRowsChange(newRows)
                }
              }}
            />
          )
        })

      return {
        field: col.key,
        headerName: col.name || col.key,
        width: typeof col.width === 'number' ? col.width : undefined,
        flex: col.width === '*' ? 1 : undefined,
        sortable,
        editable,
        renderCell,
        renderEditCell,
        align: col.hozAlign === 'center' ? 'center' : undefined,
      }
    })
  }, [baseColumns, defaultColumnOptions, onRowsChange, rowKeyGetter, rows])

  const [selectionModel, setSelectionModel] = useState(() =>
    selectedRows ? Array.from(selectedRows) : []
  )

  const handleSelectionChange = (newSelection) => {
    setSelectionModel(newSelection)
    if (onSelectedRowsChange) {
      onSelectedRowsChange(new Set(newSelection))
    }
  }

  const handleProcessRowUpdate = (newRow, oldRow) => {
    if (onRowsChange) {
      const id = rowKeyGetter(oldRow)
      const newRows = rows.map((r) => (rowKeyGetter(r) === id ? newRow : r))
      onRowsChange(newRows)
    }
    return newRow
  }

  const handleCellClick = (params) => {
    if (onSelectedCellChange) {
      const idx = muiColumns.findIndex((c) => c.field === params.field)
      const rowIdx = rows.findIndex((r) => rowKeyGetter(r) === params.id)
      onSelectedCellChange({ idx, rowIdx })
    }
  }

  const sortModel = useMemo(() => {
    if (sortColumns && sortColumns.length) {
      return sortColumns.map((s) => ({
        field: s.columnKey,
        sort: (s.direction || '').toLowerCase(),
      }))
    }
    if (sortColumn && sortDirection) {
      return [{ field: sortColumn, sort: sortDirection.toLowerCase() }]
    }
    return []
  }, [sortColumns, sortColumn, sortDirection])

  const handleSortModelChange = (model) => {
    if (onSortColumnsChange) {
      onSortColumnsChange(
        model.map((m) => ({
          columnKey: m.field,
          direction: (m.sort || 'none').toUpperCase(),
        }))
      )
    }
    if (onSort && model[0]) {
      onSort(model[0].field, (model[0].sort || 'none').toUpperCase())
    }
  }

  useImperativeHandle(ref, () => ({
    table: {
      setFilter: (_field, _operator, value) => {
        // no-op; filtering handled externally
      },
      download: (_type, filename = 'data.csv') => {
        const csv = buildCsv(muiColumns, rows)
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
    <div style={{ width: '100%', height: style?.height || '100%' }} className={className}>
      <DataGrid
        rows={rows}
        columns={muiColumns}
        getRowId={rowKeyGetter}
        checkboxSelection={hasCheckboxSelection}
        disableRowSelectionOnClick
        processRowUpdate={handleProcessRowUpdate}
        onCellClick={handleCellClick}
        onRowDoubleClick={(params) => {
          if (rest.onRowDoubleClick) {
            rest.onRowDoubleClick(null, { _row: { data: params.row } })
          }
        }}
        selectionModel={selectionModel}
        onRowSelectionModelChange={handleSelectionChange}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        columnHeaderHeight={headerRowHeight}
        rowHeight={rowHeight}
        experimentalFeatures={{ newEditingApi: true }}
        {...rest}
      />
    </div>
  )
})

export default MuiRdg
