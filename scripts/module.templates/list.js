// ui layer
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import DataGrid, { SelectColumn, TextEditor } from 'react-data-grid'
import MuiTicker from '/imports/ui/utils/data-grid/tick.js'
import {
  Container,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  Button,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AddModal from './components/add-modal'
import config from './config'

// Formatting utilities:
const dateFormat = {
  input: 'DD/MM/YY hh:mm',
  output: 'dd/MM/yyyy h:mm A',
  invalidPlaceholder: '',
}

const dateFormatter = ({ row }) =>
  DateTime.fromJSDate(row.updatedAt).toFormat(dateFormat.output)

const BooleanFormatter = (props) => (
  <span style={{ marginLeft: '40%' }}>
    <MuiTicker {...props} />
  </span>
)

const useStyles = makeStyles({
  root: { marginTop: '20px' },
  filterInput: {
    width: '100%',
  },
  addSpace: {
    marginBottom: '36px',
  },
})

const List = ({ data, methods }) => {
  const classes = useStyles()
  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState(new Set())
  const defaultSortColums = [{ columnKey: 'updatedAt', direction: 'DESC' }]
  const [sortColumns, setSortColumns] = useState(defaultSortColums)
  useEffect(() => {
    setRows(data)
  }, [data])
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const rowChange = (rows, { indexes }) => {
    methods.update(rows[indexes])
    setRows(data)
  }

  const xcolumns = useMemo(() => {
    return config.list.columns.map((col) => {
      if (col.type === 'date') col.formatter = dateFormatter
      if (col.type === 'boolean') col.formatter = BooleanFormatter

      return col
    })
  })

  const columns = useMemo(() => {
    return [
      {
        key: 'name',
        name: 'Name',
        sortable: true,
        editor: TextEditor,
      },
      {
        key: 'slug',
        name: 'Slug',
        width: 200,
        sortable: true,
        editor: TextEditor,
      },
      {
        key: 'approvalRequired',
        name: 'Approval Required',
        width: 200,
        type: 'boolean',
        formatter(props) {
          return (
            <span style={{ marginLeft: '40%' }}>
              <MuiTicker {...props} />
            </span>
          )
        },
      },
      {
        key: 'updatedAt',
        name: 'Updated',
        width: 200,
        sortable: true,
        type: 'date',
        formatter: ({ row }) => moment(row.updatedAt).format('DD/MM/YYYY HH:mm'),
      },
    ]
  })

  const getComparator = () => {
    if (!sortColumns.length) {
      return () => 0
    }
    try {
      const col = sortColumns[0].columnKey
      console.log(`Sorting ${col}`)
      const type = columns.find((column) => column.key === col)?.type || 'string'
      switch (type) {
        case 'boolean':
        case 'date':
          return (a, b) => {
            return a[col] > b[col] ? 1 : -1
          }
        // Assume anything not mentioned above is a simple string:
        default:
          return (a, b) => {
            return a[col]?.localeCompare(b[col])
          }
      }
    } catch (e) {
      console.log(`Error: ${e.message}`)
    }
  }

  const calculatedRows = useMemo(() => {
    try {
      if (sortColumns.length === 0) return rows

      let mutableRows = [...rows]

      // handle column sorting
      mutableRows.sort((a, b) => {
        for (const sort of sortColumns) {
          const comparator = getComparator(sort.columnKey)
          const compResult = comparator(a, b)
          if (compResult !== 0) {
            return sort.direction === 'ASC' ? compResult : -compResult
          }
        }
        return 0
      })

      return mutableRows
    } catch (e) {
      console.log(`Error: ${e.message}`)
    }
  }, [rows, sortColumns])

  const handleRemove = () => {
    methods.remove(selectedRows)
    setSelectedRows(new Set())
  }

  const updateInput = (e) => {
    const filtered = data.filter((row) => {
      return row.search.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setRows(filtered)
  }

  function rowKeyGetter(row) {
    return row._id
  }

  return (
    <Container>
      <Typography
        variant="h1"
        align="center"
        id="h1-mycollections-header"
        className={classes.root}
      >
        MyCollection
      </Typography>
      <Grid container spacing={1} direction="column">
        <Grid item className={classes.addSpace}></Grid>
        <Grid item container spacing={1} justify="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              id="add-mycollection-button"
              onClick={() => {
                setOpen(true)
              }}
            >
              Add Document type
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              id="remove-mycollection-button"
              onClick={handleRemove}
              disabled={!selectedRows.size}
            >
              Remove ({selectedRows.size})
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            className={classes.filterInput}
            onChange={updateInput}
            variant="outlined"
            size="small"
            id="search-my-collection"
            label="Search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <DataGrid
            rowKeyGetter={rowKeyGetter}
            columns={[SelectColumn, ...columns]}
            defaultColumnOptions={{
              sortable: true,
              resizable: true,
            }}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            rows={calculatedRows}
            onRowsChange={rowChange}
            sortColumns={sortColumns}
            onSortColumnsChange={(sorts) => {
              if (sorts && sorts.length) {
                setSortColumns(sorts)
              } else if (sortColumns[0]?.columnKey === 'updatedAt') {
                setSortColumns([{ columnKey: 'updatedAt', direction: 'ASC' }])
              } else {
                setSortColumns(defaultSortColums)
              }
            }}
          />
        </Grid>
      </Grid>
      <AddModal handleClose={handleClose} open={open} insert={methods.insert} />
    </Container>
  )
}

List.propTypes = {
  data: PropTypes.array,
  methods: PropTypes.object.isRequired,
}

export default List
