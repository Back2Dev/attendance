import React from 'react'
// import TextField from '@mui/material/TextField'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableContainer from '@mui/material/TableContainer'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import Paper from '@mui/material/Paper'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import dbg from 'debug'
const debug = dbg('app:table-field')

const rows = [
  { spent: '0', activity: 'Administration', should: '0' },
  { spent: '0', activity: 'Managing', should: '0' },
  { spent: '0', activity: 'Trouble shooting', should: '0' },
  { spent: '0', activity: '', should: '0' },
  { spent: '0', activity: '', should: '0' },
]
/**
 *
 * Table field - will become great!
 *
 */
const TableForm = (props) => {
  const { id, name } = props
  debug({ props })
  const cols = ['spent', 'activity', 'should']
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {cols.map((col) => (
              <TableCell>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowix) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {cols.map((col) => {
                return (
                  <TableCell component="th" scope="row">
                    <FormControl size="3">
                      <TextField id={`${id}.${col}.${rowix}`} defaultValue={row[col]} />
                    </FormControl>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableForm
