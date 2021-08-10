import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#192125',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontStyle: 'italic',
    borderBottom: '#263238',
  },
  body: {
    color: 'LightGrey',
    borderBottom: '#263238',
  },
}))(TableCell)

// const StyledTableRow = withStyles((theme) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }))(TableRow)

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export const ErrorPanel = () => {
  const formContext = React.useContext(EditorContext)
  const classes = useStyles()

  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right" style={{ width: '24px' }}>
              Line
            </StyledTableCell>
            <StyledTableCell>Error</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formContext.errors !== 'No Errors'
            ? formContext.errors.map((row) => (
                <TableRow key={row.lineno}>
                  <StyledTableCell component="th" scope="row" align="right">
                    {row.lineno}
                  </StyledTableCell>
                  <StyledTableCell>{row.error}</StyledTableCell>
                </TableRow>
              ))
            : []}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
