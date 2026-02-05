import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { lighten } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Input from '@mui/material/Input'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
const headCells = [
  { id: 'name', disablePadding: false, sort: true, label: 'Name' },
  { id: 'slug', disablePadding: false, sort: false, label: 'Slug' },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, selected, rowCount, onSelectAllClick } =
    props

  const numSelected = selected.length

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.bold}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <>{headCell.label}</>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.mode === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  searchField: {
    marginRight: '10px',
  },
}))

const EnhancedTableToolbar = ({
  numSelected,
  deleteRows,
  selected,
  search,
  setSearch,
  addANewRow,
}) => {
  const classes = useToolbarStyles()

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const searchField = () => {
    return (
      <FormControl className={classes.searchField}>
        <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
        <Input
          id="standard-adornment-password"
          value={search}
          onChange={handleSearch}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          variant="outlined"
        />
      </FormControl>
    )
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h1"
          color="primary"
          id="tableTitle"
          component="div"
        >
          Triggers
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              onClick={() => {
                deleteRows(selected)
              }}
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          {searchField()}
          <Button variant="contained" color="primary" onClick={addANewRow} id="add">
            Add
          </Button>
        </>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  deleteRows: PropTypes.func.isRequired,
  addANewRow: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  table: {
    width: '100%',
  },
  tableRow: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  editing: {
    backgroundColor: '#59a1fc',
    '& .MuiTableCell-body': {
      color: 'white',
      fontFamily: 'GothamRoundedMedium',
    },
    '&:hover': {
      backgroundColor: '#59a1fc !important',
    },
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  bold: {
    fontFamily: 'GothamRoundedMedium',
  },
}))

export default function EnhancedTable({
  items,
  setEditing,
  editing,
  methods,
  defaultObject,
}) {
  const classes = useStyles()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('')
  const [selected, setSelected] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [triggers, setTriggers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (page > 0) setPage(0)
    const results = items?.filter((trigger) => {
      return trigger.search?.toLowerCase().includes(search.toLowerCase())
    })
    setTriggers(results)
  }, [search, items])

  useEffect(() => {
    if (page > 0) setPage(0)
    setSelected([])
  }, [items])

  const addANewRow = () => {
    setSearch('Untitled')
    methods.insert(defaultObject)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event, item) => {
    setEditing(item)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCheckbox = (event, id) => {
    event.stopPropagation()
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }
  const isSelected = (id) => selected.indexOf(id) !== -1
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, triggers.length - page * rowsPerPage)
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = triggers?.map((n) => n._id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        deleteRows={methods.deleteRows}
        selected={selected}
        methods={methods}
        defaultObject={defaultObject}
        setSearch={setSearch}
        search={search}
        setPage={setPage}
        addANewRow={addANewRow}
      />
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={triggers.length}
            selected={selected}
            onSelectAllClick={handleSelectAllClick}
            methods={methods}
          />
          <TableBody>
            {stableSort(triggers, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row._id)
                const labelId = `enhanced-table-checkbox-${index}`
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    className={clsx(classes.tableRow, {
                      [classes.editing]: editing?._id === row._id && !isItemSelected,
                    })}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => {
                        handleCheckbox(event, row._id)
                      }}
                    >
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      className={classes.tableCell}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>{row.slug}</TableCell>
                  </TableRow>
                )
              })}
            {triggers.length < 1 && (
              <TableRow>
                <TableCell colSpan={4}>No data found</TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={triggers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  )
}

EnhancedTable.propTypes = {
  methods: PropTypes.object.isRequired,
  setEditing: PropTypes.func.isRequired,
  editing: PropTypes.object,
  defaultObject: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
}
