import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'

import { Typography } from '@material-ui/core'

import { useWindowSize } from '/imports/ui/utils/window-size.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import {
  getDataFormatter,
  formatData,
  getFieldType,
  getComparator,
} from '/imports/api/collections/utils.js'
import { CollectionContext } from './context'
import ViewsSelector from './grid/views-selector'

const StyledGrid = styled.div`
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  h1 {
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
`

function Grid() {
  const { theCollection, schema, theView, rows } = useContext(CollectionContext)
  console.log(theCollection, schema, { theView })

  const [filterText, setFilterText] = useState('')
  const [pageHeight, setPageHeight] = useState(null)
  const [sortColumns, setSortColumns] = useState([])

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
    let gridColumns = []

    if (theView?.columns?.length) {
      theView.columns.map((col) => {
        const fieldSchema = schema._schema[col.name]
        const formatter = getDataFormatter({
          type: getFieldType({ fieldSchema }),
          columnName: col.name,
        })
        gridColumns.push({
          key: col.name,
          name: col.label || col.name,
          type: col.type,
          formatter,
          width: col.width || undefined,
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
  return (
    <StyledGrid style={{ height: pageHeight | 'auto' }}>
      <Typography variant="h1">{theCollection._name}</Typography>
      <div className="filter-container">
        <SearchBox
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
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
        />
      </div>
    </StyledGrid>
  )
}

export default Grid
