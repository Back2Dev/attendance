import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'
import moment from 'moment'

import { Typography } from '@material-ui/core'

import { CollectionContext } from './context'

const StyledGrid = styled.div`
  margin: 40px 20px;
  h1 {
    margin-bottom: 20px;
  }
`

function Grid() {
  const { theCollection, schema, theView, rows } = useContext(CollectionContext)
  console.log(theCollection, schema, { theView })

  let gridColumns = []

  if (theView?.columns?.length) {
    theView.columns.map((col) => {
      let formatter
      switch (col.type) {
        case 'String':
        case 'SimpleSchema.Integer':
        case 'Integer':
        case 'Number':
          formatter = ({ row }) => row[col.name] || null
          break
        case 'Date':
          formatter = ({ row }) =>
            row[col.name] ? moment(row[col.name]).format('DD/MM/YYYY HH:mm') : null
          break
        default:
          formatter = ({ row }) =>
            row[col.name] ? JSON.stringify(row[col.name], null, 2) : null
      }
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
        let formatter
        switch (fieldType) {
          case 'String':
          case 'SimpleSchema.Integer':
            formatter = ({ row }) => row[fieldName] || null
            break
          case 'Date':
            formatter = ({ row }) =>
              row[fieldName] ? moment(row[fieldName]).format('DD/MM/YYYY HH:mm') : null
            break
          default:
            formatter = ({ row }) =>
              row[fieldName] ? JSON.stringify(row[fieldName], null, 2) : null
        }
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

  const rowKeyGetter = (row) => {
    return row._id
  }

  return (
    <StyledGrid>
      <Typography variant="h1">{theCollection._name}</Typography>
      <div className="grid-container">
        <DataGrid
          rowKeyGetter={rowKeyGetter}
          columns={gridColumns}
          rows={rows}
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
