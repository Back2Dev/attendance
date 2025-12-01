import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import config from './config'

const debug = require('debug')('app:edit')

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

const View = ({ item }) => {
  const classes = useStyles()

  return (
    <div>
      <Typography color="primary" variant="h5">
        Standups: {item.name} (Revision {item.revision}: &nbsp;
        {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          {config.view.header && (
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {config.view.rows.map((row, ix) => (
              <TableRow key={ix}>
                <TableCell component="th" scope="row" key="1">
                  {row.label || row.field}
                </TableCell>
                <TableCell key="2">{item[row.field]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

View.propTypes = {
  item: PropTypes.object.isRequired,
}
export default View
