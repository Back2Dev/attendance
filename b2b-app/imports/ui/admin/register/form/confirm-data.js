import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell)

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(4),
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
}))

const ConfirmData = ({ title, onEdit, fieldData }) => {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <CardHeader
        title={title}
        action={
          <IconButton aria-label={'edit ' + title} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Table>
          <TableBody>
            {fieldData.map(({ label, value }, i) => (
              <TableRow key={i}>
                <TableCell className={classes.fieldLabel}>{label}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

ConfirmData.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  fieldData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }).isRequired
  ).isRequired,
}

export default ConfirmData
