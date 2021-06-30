import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Paper,
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
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import {
  termsFormBridge,
  contactFormBridge,
  emergencyFormBridge,
  aboutFormBridge,
} from './form-schemas'
import FormNav from './form-nav'
import { RegisterContext } from '../context'

const useStyles = makeStyles({
  confirmContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: '1rem',
    },
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
})

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell)

const schemas = [contactFormBridge, aboutFormBridge, emergencyFormBridge]
const stepLabels = ['Contact details', 'About you', 'Emergency contact']

const ConfirmForm = ({ onSubmit, model }) => {
  const classes = useStyles()
  const { dispatch, models } = useContext(RegisterContext)
  const getFormValue = (modelIndex, fieldName) => {
    const value = models[modelIndex][fieldName]
    if (typeof value === 'undefined') {
      return '-'
    }
    return value
  }

  console.log(
    Object.entries(contactFormBridge.schema['_schema']).map(
      ([field, data]) => data.label + ' ' + getFormValue(0, field)
    )
  )

  return (
    <div className={classes.confirmContainer}>
      {stepLabels.map((title, i) => (
        <Card key={i}>
          <CardHeader
            title={title}
            action={
              <IconButton
                aria-label={'edit ' + title}
                onClick={() => dispatch({ type: 'go_edit_step', step: i })}
              >
                <EditIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(schemas[i].schema['_schema']).map(([field, data]) => (
                  <TableRow key={field}>
                    <TableCell className={classes.fieldLabel}>{data.label}</TableCell>
                    <TableCell>{getFormValue(i, field)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Paper style={{ padding: '2rem', paddingBottom: '0' }}>
        <div>
          <AutoForm schema={termsFormBridge} onSubmit={onSubmit} model={model}>
            <AutoFields />
            <ErrorsField />
            <FormNav />
          </AutoForm>
        </div>
      </Paper>
    </div>
  )
}

ConfirmForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { ConfirmForm }
