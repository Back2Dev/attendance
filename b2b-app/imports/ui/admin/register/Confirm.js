import React from 'react'
import PropTypes from 'prop-types'

import {
  termsFormBridge,
  contactFormBridge,
  emergencyFormBridge,
  aboutFormBridge,
} from './formSchemas'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import EditIcon from '@material-ui/icons/Edit'

import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'
import { IconButton } from '@material-ui/core'
import { Table, TableBody, TableRow } from '@material-ui/core'
import MuiTableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  formButtons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  buttonGroup: {
    width: '100%',
  },
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
}))

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell)

const schemas = [contactFormBridge, aboutFormBridge, emergencyFormBridge]
const stepLabels = ['Contact details', 'About you', 'Emergency contact']

const Confirm = ({ onSubmit, model, onBack, models, onStepChange }) => {
  const classes = useStyles()

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
              <IconButton aria-label={'edit ' + title} onClick={() => onStepChange(i)}>
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
            <div className={classes.buttonGroup}>
              <div style={{ direction: 'rtl' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.formButtons}
                >
                  Submit
                </Button>
                <Button
                  onClick={onBack}
                  className={(classes.formButtons, classes.backButton)}
                >
                  Back
                </Button>
              </div>
            </div>
          </AutoForm>
        </div>
      </Paper>
    </div>
  )
}

Confirm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  models: PropTypes.array.isRequired,
  onStepChange: PropTypes.func.isRequired,
}

export { Confirm }
