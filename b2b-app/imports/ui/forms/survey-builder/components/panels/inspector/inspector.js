import React, { useContext } from 'react'
import debug from 'debug'
import { EditProperty, QuestionProperty, SectionProperty } from './edit-property'
import { Section } from './section'
import { makeStyles } from '@material-ui/core/styles'
import { DebugProps } from './debug-props'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'
import { useSetSelectedPart } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { EditorContext } from '/imports/ui/forms/framework/framework'

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
    },
    position: 'sticky',
    top: '10px',
  },
}))

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const classes = useStyles()
  const editorCtx = useContext(EditorContext)

  // FIXME add onClose/Open handlers for drawer

  // if (!selectedPart) return null

  // const part = list.findById(parts, selectedPart)
  // if (!part) return null

  return (
    <div className={classes.root}>
      {editorCtx.viewJSON && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DebugProps />
        </ErrorBoundary>
      )}
    </div>
  )
}

Inspector.Section = Section
Inspector.Property = EditProperty
Inspector.Question = QuestionProperty
Inspector.SectionProperty = SectionProperty

export { Inspector }
