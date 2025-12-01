import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SearchIcon from '@mui/icons-material/Search'
import { DateTime } from 'luxon'
import { obj2Search } from '/imports/api/util'

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
  { id: 'expand', disablePadding: true, sort: false, label: '' },
  { id: 'createdAt', disablePadding: false, sort: true, label: 'Created' },
  { id: 'type', disablePadding: false, sort: false, label: 'Type' },
  { id: 'to', disablePadding: false, sort: false, label: 'To' },
  { id: 'subject', disablePadding: false, sort: true, label: 'Subject' },
  { id: 'status', disablePadding: false, sort: true, label: 'Status' },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
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
}

const useStyles = makeStyles((theme) => ({
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
    '&$selected, &$selected:hover': {
      backgroundColor: '#4794fc',
    },
  },
  tableCell: {
    '$selected &': {
      color: 'white',
    },
  },
  selected: {},
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
  pillReady: {
    backgroundColor: '#4794fc',
    color: '#ffffff',
  },
  pillSent: {
    backgroundColor: '#31a750',
    color: '#ffffff',
  },
  pillFailed: {
    backgroundColor: '#ea4435',
    color: '#ffffff',
  },
}))

export default function UserMessages({ messages }) {
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('createdAt')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])

  const classes = useStyles()

  useEffect(() => {
    const results = messages?.filter((message) => {
      const string = obj2Search(message)
      return string.toLowerCase().includes(search.toLowerCase())
    })
    setFiltered(results)
  }, [search])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, filtered.length - page * rowsPerPage)

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  })

  const PILLS = {
    ready: <Chip label="Ready" className={classes.pillReady} />,
    queued: <Chip label="Queued" />,
    sent: <Chip label="Sent" className={classes.pillSent} />,
    failed: <Chip label="Failed" className={classes.pillFailed} />,
    cancelled: <Chip label="Cancelled" />,
  }

  function Row({ row, labelId }) {
    const [open, setOpen] = React.useState(false)
    const classes = useRowStyles()

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            className={classes.tableCell}
          >
            {DateTime.fromJSDate(row.createdAt)
              .setZone('Australia/Sydney')
              .toLocaleString(DateTime.DATETIME_SHORT)}
          </TableCell>
          <TableCell className={classes.tableCell}>{row.type}</TableCell>
          <TableCell className={classes.tableCell}>
            {row.type === 'app' ? 'In-app' : row.to}
          </TableCell>
          <TableCell className={classes.tableCell}>{row.subject}</TableCell>
          <TableCell className={classes.tableCell}>{PILLS[row.status]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={3}>
                <Typography variant="h6">Body</Typography>
                <Typography variant="body1" gutterBottom component="div">
                  {row.type === 'email' ? (
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: row.body,
                      }}
                    />
                  ) : (
                    row.body
                  )}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
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
    <div className={classes.root}>
      {searchField()}
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
            rowCount={filtered.length}
          />
          <TableBody>
            {stableSort(filtered, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-${index}`

                return <Row key={row._id} row={row} labelId={labelId} />
              })}
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
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
UserMessages.propTypes = {
  messages: PropTypes.array.isRequired,
}
