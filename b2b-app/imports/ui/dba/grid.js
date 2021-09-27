import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import DataGrid, { SelectColumn } from 'react-data-grid'
import { useHistory } from 'react-router'

import { Button, Typography } from '@material-ui/core'
import ArchiveIcon from '@material-ui/icons/Archive'

import { useWindowSize } from '/imports/ui/utils/window-size.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import { useConfirm } from '/imports/ui/components/commons/confirm-box.js'
import {
  getDataFormatter,
  formatData,
  getFieldType,
  getComparator,
} from '/imports/api/collections/utils.js'
import CellEditor from './grid/cell-editor'
import { CollectionContext } from './context'
import ViewsSelector from './grid/views-selector'

const StyledGrid = styled.div`
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  h1 {
  }
  .filter-container {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .left {
      display: flex;
      flex-direction: row;
      flex: 1;
      flex-wrap: wrap;
      margin-right: 10px;
      align-items: center;

      .search-box {
        margin-right: 10px;
      }
    }
  }
  .grid-container {
    flex: 1;
  }
`

function Grid() {
  const { theCollection, schema, theView, rows, updateCell, archive } = useContext(
    CollectionContext
  )
  console.log(theCollection, schema, { theView })

  const history = useHistory()
  const { showConfirm } = useConfirm()

  const selectedCell = useRef({ idx: null, rowIdx: null })

  const [filterText, setFilterText] = useState('')
  const [pageHeight, setPageHeight] = useState(null)
  const [sortColumns, setSortColumns] = useState([])
  const [selectedRows, setSelectedRows] = useState(() => new Set())

  const windowSize = useWindowSize()
  useEffect(() => {
    console.log({ windowSize })
    // find the header height
    const headerElm = document.querySelector('header.MuiAppBar-root')
    console.log(headerElm?.offsetHeight)
    if (headerElm) {
      setPageHeight(windowSize.height - headerElm.offsetHeight)
    }
  }, [windowSize])

  const columns = useMemo(() => {
    let gridColumns = [SelectColumn]

    if (theView?.columns?.length) {
      theView.columns.map((col) => {
        const fieldSchema = schema._schema[col.name]
        const fieldType = getFieldType({ fieldSchema })
        const formatter = getDataFormatter({
          type: fieldType,
          columnName: col.name,
        })
        gridColumns.push({
          key: col.name,
          name: col.label || col.name,
          type: fieldType,
          formatter,
          width: col.width || undefined,
          editable: col.readOnly !== true,
          editor: col.readOnly ? undefined : CellEditor,
        })
      })
    } else if (schema?._schema && schema?._firstLevelSchemaKeys) {
      // get columns from schema
      schema._firstLevelSchemaKeys.map((fieldName) => {
        const field = schema._schema[fieldName]
        const fieldType = getFieldType({ fieldSchema: field })
        console.log({ fieldType })
        if (fieldType) {
          const formatter = getDataFormatter({ type: fieldType, columnName: fieldName })
          gridColumns.push({
            key: fieldName,
            name: field.label || fieldName,
            type: fieldType,
            formatter,
          })
        }
      })
    }

    console.log(gridColumns)

    return gridColumns
  }, [theView?.columns, schema])

  const handleRowsChange = (newRows) => {
    // console.log('on Rows changed', newRows)
    const { idx, rowIdx } = selectedCell.current
    if (idx >= 0 && rowIdx >= 0) {
      const rowChanged = newRows[rowIdx]
      const columnChanged = columns[idx]
      // console.log('columnChanged', columnChanged)
      const cellChanged = columnChanged && rowChanged?.[columnChanged.key]
      // console.log({ rowChanged, cellChanged })
      if (columnChanged) {
        updateCell({
          rowId: rowChanged._id,
          column: columnChanged.key,
          value: cellChanged,
        })
      }
    }
  }

  const handleSelectedCellChange = ({ idx, rowIdx }) => {
    console.log('on Selected Cell changed', idx, rowIdx)
    selectedCell.current = { idx, rowIdx }
  }

  console.log(rows)

  const calculatedRows = useMemo(() => {
    let mutableRows = [...rows]

    // handle column sorting
    // console.log(sortColumns)
    if (sortColumns?.[0]) {
      // console.log(sortColumns[0])
      const { columnKey: fieldName, direction } = sortColumns[0]
      const field = schema._schema[fieldName]
      const fieldType = getFieldType({ fieldSchema: field })
      const comparator = getComparator({
        fieldType,
        fieldName,
        direction,
      })
      // console.log({ field, fieldType })
      // console.log('comparator', comparator)
      if (comparator) {
        mutableRows.sort(comparator)
      }
    }

    // handle global search
    if (filterText && filterText.length >= 2) {
      const reg = new RegExp(filterText, 'i')
      mutableRows = mutableRows.filter((row) => {
        const strsToSearch = columns.map((col) => {
          return `${formatData({ data: row[col.key], type: col.type })}` || ''
        })
        return reg.test(strsToSearch.join(' '))
      })
    }

    return mutableRows
  }, [rows, filterText, sortColumns])

  const rowKeyGetter = (row) => {
    return row._id
  }

  if (!theCollection) {
    return (
      <StyledGrid>
        <Typography variant="h1">Opps! There collection was not found</Typography>
      </StyledGrid>
    )
  }

  console.log('sortColumns', sortColumns)
  console.log('selectedRows', selectedRows)
  return (
    <StyledGrid style={{ height: pageHeight | 'auto' }}>
      <div className="header">
        <Typography variant="h1">{theCollection._name}</Typography>
        <Button
          variant="text"
          onClick={() => history.push(`/dba/archives/${theCollection._name}`)}
        >
          Archives
        </Button>
      </div>
      <div className="filter-container">
        <div className="left">
          <SearchBox
            className="search-box"
            onChange={(searchQuery) => {
              setFilterText(searchQuery)
            }}
          />
          <div className="selected-row-actions">
            {selectedRows.size > 0 && (
              <Button
                size="small"
                startIcon={<ArchiveIcon />}
                variant="outlined"
                onClick={() =>
                  showConfirm({
                    onConfirm: () => archive({ selectedIds: Array.from(selectedRows) }),
                  })
                }
              >
                Archive
              </Button>
            )}
          </div>
        </div>
        <ViewsSelector />
      </div>
      <div className="grid-container">
        <DataGrid
          rowKeyGetter={rowKeyGetter}
          columns={columns}
          rows={calculatedRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={(sorts) => {
            setSortColumns(sorts)
          }}
          // onRowClick={(index, row) => push(`/services/${row._id}`)}
          className="collection-grid"
          style={{ height: '99%' }}
          onRowsChange={handleRowsChange}
          onSelectedCellChange={handleSelectedCellChange}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      </div>
    </StyledGrid>
  )
}

export default Grid
