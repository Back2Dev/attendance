import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'
import moment from 'moment'

import { Typography } from '@material-ui/core'

import SearchBox from '/imports/ui/components/commons/search-box.js'
import { getDataFormatter, formatData } from '/imports/api/collections/utils.js'
import { CollectionContext } from './context'

const StyledGrid = styled.div`
  margin: 40px 20px;
  h1 {
    margin-bottom: 20px;
  }
  .filter-container {
    margin-bottom: 10px;
  }
`

function Grid() {
  const { theCollection, schema, theView, rows } = useContext(CollectionContext)
  console.log(theCollection, schema, { theView })

  const [filterText, setFilterText] = useState('')

  let gridColumns = []

  if (theView?.columns?.length) {
    theView.columns.map((col) => {
      const formatter = getDataFormatter({ type: col.type, columnName: col.name })
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
      const fieldType =
        typeof field.type?.definitions?.[0]?.type === 'string'
          ? field.type?.definitions?.[0]?.type
          : field.type?.definitions?.[0]?.type?.name
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
  console.log(rows)

  const calculatedRows = useMemo(() => {
    let mutableRows = [...rows]

    // handle column sorting
    // mutableRows.sort((a, b) => {
    //   for (const sort of sortColumns) {
    //     const comparator = getComparator(sort.columnKey)
    //     const compResult = comparator(a, b)
    //     if (compResult !== 0) {
    //       return sort.direction === 'ASC' ? compResult : -compResult
    //     }
    //   }
    //   return 0
    // })

    // handle global search
    if (filterText && filterText.length >= 2) {
      const reg = new RegExp(filterText, 'i')
      mutableRows = mutableRows.filter((row) => {
        const strsToSearch = gridColumns.map((col) => {
          return `${formatData({ data: row[col.key], type: col.type })}` || ''
        })
        return reg.test(strsToSearch.join(' '))
      })
    }

    return mutableRows
  }, [rows, filterText])

  const rowKeyGetter = (row) => {
    return row._id
  }

  return (
    <StyledGrid>
      <Typography variant="h1">{theCollection._name}</Typography>
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
          columns={gridColumns}
          rows={calculatedRows}
          defaultColumnOptions={{
            // sortable: true,
            resizable: true,
          }}
          // sortColumns={sortColumns}
          // onSortColumnsChange={(sorts) => {
          //   if (sorts && sorts.length) {
          //     setSortColumns(sorts)
          //   } else if (sortColumns[0]?.columnKey === 'createdAt') {
          //     setSortColumns([{ columnKey: 'createdAt', direction: 'ASC' }])
          //   } else {
          //     setSortColumns(defaultSortColums)
          //   }
          // }}
          // onRowClick={(index, row) => push(`/services/${row._id}`)}
          className="collection-grid"
        />
      </div>
    </StyledGrid>
  )
}

export default Grid
