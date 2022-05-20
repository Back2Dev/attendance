import React, { createElement, useState } from 'react'
import debug from 'debug'
import {
  useSelectedPartValue,
  usePartsValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { list } from '/imports/ui/forms/survey-builder/utils'
import { EditProperty, QuestionProperty } from './edit-property'
import { Section } from './section'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { makeStyles } from '@material-ui/core/styles'
import { DebugProps } from './debug-props'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'
import { useSetSelectedPart } from '/imports/ui/forms/survey-builder/recoil/hooks'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

const log = debug('builder:inspector')

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const setSelectedPart = useSetSelectedPart()
  return (
    <div>
      <p>Oops, DebugProps made a booboo</p>
      <pre>{error.message}</pre>
      <button
        onClick={() => {
          setSelectedPart(null)
          resetErrorBoundary()
        }}
      >
        Reset
      </button>
    </div>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '90%%',
    },
  },
  jsonView: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '0.9rem',
    paddingRight: '0.9rem',
  },
}))

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const [viewJSON, setViewJSON] = useState(false)
  const classes = useStyles()
  const selectedPart = useSelectedPartValue()
  const parts = usePartsValue()
  // FIXME add onClose/Open handlers for drawer

  if (!selectedPart) return null

  const part = list.findById(parts, selectedPart)
  if (!part) return null

  return (
    <div className={classes.root}>
      <div className={classes.jsonView}>
        <Typography variant="h6">change view</Typography>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => setViewJSON(!viewJSON)}
        >
          <VisibilityIcon />
        </IconButton>
      </div>

      {viewJSON ? (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DebugProps />
        </ErrorBoundary>
      ) : (
        selectedPart !== null && createElement(part.config.inspectorProperties)
      )}
    </div>
  )
}

Inspector.Section = Section
Inspector.Property = EditProperty
Inspector.Question = QuestionProperty

export { Inspector }
