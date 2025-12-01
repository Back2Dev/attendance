import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

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

  const getErrorTable = () => {
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

  return formContext.errors !== 'No Errors' ? (
    getErrorTable()
  ) : (
    <h4 className="noErrors"> ✅ No Errors</h4>
  )
}
