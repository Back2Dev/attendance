import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import DataGrid, { SelectColumn } from 'react-data-grid'
import { useHistory } from 'react-router'

import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import ArchiveIcon from '@material-ui/icons/Archive'

import { useWindowSize } from '/imports/ui/utils/window-size.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import {
  formatData,
  getFieldType,
  getComparator,
} from '/imports/api/collections/utils.js'
import DataFormatter from './grid/formaters'
import CellEditor from './grid/editors'
import { CollectionContext } from './context'
import ViewsSelector from './grid/views-selector'

const debug = require('debug')('app:dba-grid')

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

const StyledArchiveBox = styled.div``

function Grid() {
  const {
    theCollection,
    schema,
    theView,
    rows,
    updateCell,
    archive,
    link2Archives = false,
  } = useContext(CollectionContext)
  debug(theCollection, schema, { theView })

  const history = useHistory()
  // const { showConfirm } = useConfirm()

  const selectedCell = useRef({ idx: null, rowIdx: null })

  const [filterText, setFilterText] = useState('')
  const [pageHeight, setPageHeight] = useState(null)
  const [sortColumns, setSortColumns] = useState([])
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const [archiveLabel, setArchiveLabel] = useState('')
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false)

  const windowSize = useWindowSize()
  useEffect(() => {
    debug({ windowSize })
    // find the header height
    const headerElm = document.querySelector('header.MuiAppBar-root')
    debug(headerElm?.offsetHeight)
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

        gridColumns.push({
          key: col.name,
          name: col.label || col.name,
          type: fieldType,
          formatter: DataFormatter,
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
        debug({ fieldType })
        if (fieldType) {
          gridColumns.push({
            key: fieldName,
            name: field.label || fieldName,
            type: fieldType,
            formatter: DataFormatter,
          })
        }
      })
    }

    debug('gridColumns', gridColumns)

    return gridColumns
  }, [theView?.columns, schema])

  const handleArchiveBtnClick = () => {
    setOpenArchiveDialog(true)
  }

  const handleRowsChange = (newRows) => {
    // debug('on Rows changed', newRows)
    const { idx, rowIdx } = selectedCell.current
    if (idx >= 0 && rowIdx >= 0) {
      const rowChanged = newRows[rowIdx]
      const columnChanged = columns[idx]
      debug('columnChanged', columnChanged)
      const cellChanged = columnChanged && rowChanged?.[columnChanged.key]
      debug({ rowChanged, cellChanged })
      if (columnChanged) {
        const cellBeforeChanged = rows[rowIdx]?.[columnChanged.key]
        updateCell({
          rowId: rowChanged._id,
          column: columnChanged.key,
          value: cellChanged,
          cb: (result) => {
            debug('result', result)
            debug('cellBeforeChanged', cellBeforeChanged)
            if (result.status === 'failed') {
              // rollback
              debug('rollback now')
              updateCell({
                rowId: rowChanged._id,
                column: columnChanged.key,
                value: cellBeforeChanged,
                localOnly: true,
              })
            }
          },
        })
      }
    }
  }

  const handleSelectedCellChange = ({ idx, rowIdx }) => {
    debug('on Selected Cell changed', idx, rowIdx)
    selectedCell.current = { idx, rowIdx }
  }

  debug(rows)

  const calculatedRows = useMemo(() => {
    let mutableRows = [...rows]

    // handle column sorting
    // debug(sortColumns)
    if (sortColumns?.[0]) {
      // debug(sortColumns[0])
      const { columnKey: fieldName, direction } = sortColumns[0]
      const field = schema._schema[fieldName]
      const fieldType = getFieldType({ fieldSchema: field })
      const comparator = getComparator({
        fieldType,
        fieldName,
        direction,
      })
      // debug({ field, fieldType })
      // debug('comparator', comparator)
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
        <Typography variant="h1">Oops! The collection has no definition</Typography>
        <Typography>
          Either the collection doesn't exist, or maybe you need to run
          scripts/bind-collections.js
        </Typography>
      </StyledGrid>
    )
  }

  debug('sortColumns', sortColumns)
  debug('selectedRows', selectedRows)
  return (
    <StyledGrid style={{ height: pageHeight | 'auto' }}>
      <div className="header">
        <Typography variant="h1">{theCollection._name}</Typography>
        {link2Archives && (
          <Button
            variant="text"
            onClick={() => history.push(`/dba/archives/${theCollection._name}`)}
          >
            Archives
          </Button>
        )}
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
                onClick={handleArchiveBtnClick}
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
      <Dialog
        open={openArchiveDialog}
        onClose={() => {
          openArchiveDialog && setOpenArchiveDialog(false)
        }}
        aria-labelledby="archive-dialog-title"
        aria-describedby="archive-dialog-description"
      >
        <StyledArchiveBox>
          <DialogTitle>Delete this view\nAre you sure?</DialogTitle>
          <DialogContent>
            <TextField
              value={archiveLabel}
              onChange={(event) => {
                setArchiveLabel(event.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setArchiveLabel('')
                setOpenArchiveDialog(false)
              }}
              color="secondary"
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                archive({
                  selectedIds: Array.from(selectedRows),
                  label: archiveLabel,
                })
                setArchiveLabel('')
                openArchiveDialog && setOpenArchiveDialog(false)
              }}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </StyledArchiveBox>
      </Dialog>
    </StyledGrid>
  )
}

export default Grid
