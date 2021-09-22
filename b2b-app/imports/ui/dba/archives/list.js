import React, { useContext, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import DataGrid, { SelectColumn } from 'react-data-grid'
import { useHistory } from 'react-router'
import { Typography, Button, FormControlLabel, Switch } from '@material-ui/core'
import RestoreIcon from '@material-ui/icons/Restore'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import moment from 'moment'

import { useWindowSize } from '/imports/ui/utils/window-size.js'
import { ArchivesContext } from './context'
import { ArchivesSchema } from '/imports/api/collections/archive-schema.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import { useConfirm } from '/imports/ui/components/commons/confirm-box.js'
import {
  formatData,
  getFieldType,
  getComparator,
} from '/imports/api/collections/utils.js'

const StyledArchivesList = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .filter-container {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .grid-container {
    flex: 1;
  }
  .selected-row-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .restore-action {
      display: flex;
      flex-direction: row;
      button {
        margin-right: 20px;
      }
    }
  }
`

function ArchivesList() {
  const { collectionName, rows, restore, remove } = useContext(ArchivesContext)
  console.log('collection', collectionName)

  const history = useHistory()
  const { showConfirm } = useConfirm()

  const [filterText, setFilterText] = useState('')
  const [pageHeight, setPageHeight] = useState(null)
  const [sortColumns, setSortColumns] = useState([])
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const [keepTheCopy, setKeepTheCopy] = useState(false)

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

  const columns = [
    SelectColumn,
    {
      key: '_id',
      name: 'ID',
      type: 'String',
      editable: false,
    },
    {
      key: 'type',
      name: 'Collection',
      type: 'String',
      editable: false,
    },
    {
      key: 'dataId',
      name: 'Data ID',
      type: 'String',
      editable: false,
      formatter: ({ row }) => {
        const dataIds = row.data.map((item) => item.dataId)
        return dataIds.join(', ')
      },
    },
    {
      key: 'createdBy',
      name: 'Created by',
      type: 'String',
      editable: false,
      formatter: ({ row }) => row.createdBy.username,
    },
    {
      key: 'createdAt',
      name: 'Created at',
      type: 'Date',
      formatter: ({ row }) => moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
      editable: false,
    },
  ]

  const calculatedRows = useMemo(() => {
    let mutableRows = [...rows]

    // handle column sorting
    // console.log(sortColumns)
    if (sortColumns?.[0]) {
      // console.log(sortColumns[0])
      const { columnKey: fieldName, direction } = sortColumns[0]
      const field = ArchivesSchema._schema[fieldName]
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
          if (col.key === 'createdBy') {
            return row.createdBy.username
          }
          if (col.key === 'dataId') {
            return row.data.map((item) => item.dataId).join(', ')
          }
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

  console.log('calculatedRows', calculatedRows)
  console.log('sortColumns', sortColumns)
  console.log('selectedRows', selectedRows)
  return (
    <StyledArchivesList style={{ height: pageHeight | 'auto' }}>
      <div className="header">
        <Typography variant="h1">
          {collectionName ? `${collectionName} : ` : ''}Archives
        </Typography>
        {collectionName && (
          <Button variant="text" onClick={() => history.push(`/dba/${collectionName}`)}>
            List
          </Button>
        )}
      </div>
      <div className="filter-container">
        <SearchBox
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
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
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      </div>
      <div className="selected-row-actions">
        {selectedRows.size > 0 && (
          <>
            <div className="restore-action">
              <Button
                startIcon={<RestoreIcon />}
                variant="outlined"
                onClick={() =>
                  showConfirm({
                    onConfirm: () =>
                      restore({ selectedIds: Array.from(selectedRows), keepTheCopy }),
                  })
                }
              >
                Restore
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={keepTheCopy}
                    onChange={(e) => {
                      setKeepTheCopy(e.target.checked)
                    }}
                  />
                }
                label="Keep the copy"
              />
            </div>
            <Button
              startIcon={<DeleteForeverIcon />}
              variant="outlined"
              onClick={() =>
                showConfirm({
                  message: 'This cannot be undone',
                  onConfirm: () => remove({ selectedIds: Array.from(selectedRows) }),
                })
              }
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </StyledArchivesList>
  )
}

export default ArchivesList
