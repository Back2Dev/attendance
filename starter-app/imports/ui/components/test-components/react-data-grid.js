import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FormLabel, Button } from '@material-ui/core'

import DataGrid, { SelectColumn, TextEditor, SelectCellFormatter } from 'react-data-grid'

import ModalEdit from '/imports/ui/utils/data-grid/modal-text-area.js'
import MuiSelector from '/imports/ui/utils/data-grid/selector.js'

const StyledTestDataGrid = styled.div`
  .buttons {
    button {
      margin: 0 5px;
    }
  }
`

function TestDataGrid() {
  const [internalRows, setInternalRows] = useState([
    { id: 'Some Id', name: 2, done: 'some text', optional: true },
  ])
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE'])
  const [selectedRows, setSelectedRows] = useState(new Set())

  const options = [
    { value: '1', text: 'One' },
    { value: '2', text: 'Two' },
    { value: '3', text: 'Three' },
  ]

  const columns = [
    { key: 'id', name: 'ID', editor: TextEditor },
    {
      key: 'name',
      name: 'Name',
      formatter(props) {
        return <MuiSelector {...props} options={options} />
      },
    },
    {
      key: 'done',
      name: 'Long Text',
      formatter(props) {
        return <ModalEdit {...props} />
      },
      sortable: false,
    },
    {
      key: 'optional',
      name: 'Optional',
      width: 80,
      formatter({ row, onRowChange, isCellSelected }) {
        return (
          <SelectCellFormatter
            tabIndex={-1}
            value={row.optional}
            onChange={() => {
              onRowChange({ ...row, optional: !row.optional })
            }}
            onClick={(e) => e.stopPropagation()}
            isCellSelected={isCellSelected}
          />
        )
      },
    },
  ]
  const defaultRow = { id: '', name: '', done: '', optional: false }

  function rowKeyGetter(row) {
    return row.id
  }

  const sortedRows = useMemo(() => {
    // console.log(sortDirection, sortColumn)
    if (sortDirection === 'NONE') return internalRows

    let sortedRows = [...internalRows]

    switch (sortColumn) {
      case 'id':
      case 'name':
        sortedRows = sortedRows.sort((a, b) => a[sortColumn].localeCompare(b[sortColumn]))
        break
      case 'done':
        break
      case 'optional':
        sortedRows = sortedRows.sort((a, b) => {
          if (a[sortColumn] === b[sortColumn]) return 0
          return a[sortColumn] && !b[sortColumn] ? 1 : -1
        })
        break
      default:
    }

    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows
  }, [internalRows, sortDirection, sortColumn])

  const add = () => {
    setInternalRows([...internalRows, defaultRow])
  }

  const remove = () => {
    const newRows = []
    internalRows.map((row) => {
      if (!selectedRows.has(rowKeyGetter(row))) {
        newRows.push(row)
      }
    })
    setInternalRows(newRows)
  }

  const headerRowHeight = 35
  const rowHeight = 50
  const tableHeight = headerRowHeight + sortedRows.length * rowHeight + 4

  return (
    <StyledTestDataGrid>
      <FormLabel>Checkboxes:</FormLabel>
      <div className="buttons">
        <Button size="small" onClick={add}>
          Add
        </Button>
        {selectedRows.size ? (
          <Button size="small" onClick={remove}>
            Remove
          </Button>
        ) : null}
      </div>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columns={[SelectColumn, ...columns]}
        rows={sortedRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        onRowsChange={(newRows) => {
          setInternalRows(newRows)
        }}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(columnKey, direction) => setSort([columnKey, direction])}
        style={{ height: `${tableHeight}px`, overflowY: 'auto' }}
        className="fill-grid"
        headerRowHeight={headerRowHeight}
        rowHeight={rowHeight}
      />
    </StyledTestDataGrid>
  )
}

TestDataGrid.propTypes = {}

TestDataGrid.defaultProps = {}

export default TestDataGrid
