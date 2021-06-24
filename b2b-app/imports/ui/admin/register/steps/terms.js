import React, { useRef, useContext } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import EditIcon from '@material-ui/icons/Edit'
import _ from 'lodash'

import StepButtons from './step-buttons'
import {
  termsSchema,
  aboutSchema,
  contactSchema,
  emergencySchema,
  avatarSchema,
} from '../form-schema'
import { RegisterContext } from './context'

const useStyles = makeStyles((theme) => ({
  root: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'terms'
      'privacy'
      'stepButtons'`,
  },
  listSubheader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  list: {
    marginBottom: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  termsHeader: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

const Terms = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  const { models, steps, dispatch } = useContext(RegisterContext)
  const schemas = [aboutSchema, contactSchema, emergencySchema, avatarSchema]
  const confirmModels = models.map((model) => _.omit(model, ['pin', 'pinConfirm']))
  return (
    <AutoForm
      schema={termsSchema}
      placeholder
      ref={formRef}
      model={initialData}
      style={{ display: 'block' }}
    >
      {confirmModels.slice(0, -1).map((model, stepNum) => (
        <List
          dense
          disablePadding
          subheader={
            <ListSubheader
              disableGutters
              className={classes.listSubheader}
              color="primary"
              disableSticky
            >
              <div>{steps[stepNum]}</div>
              <Button
                color="default"
                className={classes.button}
                startIcon={<EditIcon />}
                size="small"
                onClick={() => dispatch({ type: 'go_edit_step', step: stepNum })}
              >
                Edit
              </Button>
            </ListSubheader>
          }
          key={stepNum}
          className={classes.list}
        >
          {!_.isEmpty(model) ? (
            Object.entries(model).map(([field, value], idx) => (
              <div key={idx}>
                <ListItem disableGutters>
                  {field !== 'avatar' ? (
                    <ListItemText
                      primary={value}
                      secondary={schemas[stepNum].schema.label(field)}
                    />
                  ) : (
                    <ListItemAvatar>
                      <Avatar
                        src={`/images/avatars/${value}`}
                        alt={value}
                        className={classes.avatar}
                      />
                    </ListItemAvatar>
                  )}
                </ListItem>
                {idx !== Object.keys(model).length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <ListItem disableGutters>
              <ListItemText primary="This section is empty" />
            </ListItem>
          )}
        </List>
      ))}
      <Typography variant="h3" className={classes.termsHeader}>
        Terms
      </Typography>
      <Typography>
        I consent to Back2bikes storing the information I have provided above. I
        understand that Back2bikes will not disclose the above information without my
        express consent other than for reasons related to my engagement as a volunteer.
      </Typography>
      {Object.keys(termsSchema.schema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} />
          <ErrorField name={name} />
        </div>
      ))}
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

Terms.propTypes = {
  initialData: PropTypes.object,
}

Terms.defaultProps = {
  initialData: {},
}

export default Terms
