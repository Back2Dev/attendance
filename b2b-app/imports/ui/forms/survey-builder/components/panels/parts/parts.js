import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'

import { DebugProps } from '../inspector/debug-props'
import debug from 'debug'
import {
  useParts,
  useSetSelectedPart,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'

const log = debug('builder:parts')

// const ErrorFallback = ({ error, resetErrorBoundary }) => {
//   const setSelectedPart = useSetSelectedPart()
//   return (
//     <div>
//       <p>Oops, DebugProps made a booboo</p>
//       <pre>{error.message}</pre>
//       <button
//         onClick={() => {
//           setSelectedPart(null)
//           resetErrorBoundary()
//         }}
//       >
//         Reset
//       </button>
//     </div>
//   )
// }

// ErrorFallback.propTypes = {
//   error: PropTypes.object,
//   resetErrorBoundary: PropTypes.func,
// }

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'flex-direction': 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

const Parts = () => {
  const { addPart } = useParts()
  const classes = useStyles()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div className={classes.root}>
      <ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical outlined primary button group"
      >
        <Button onClick={() => addPart('single')}>Single</Button>
        <Button onClick={() => addPart('upload')}>Upload</Button>
        <Button onClick={() => addPart('multiple')}>Multiple</Button>
        <Button onClick={() => addPart('image')}>Image</Button>
      </ButtonGroup>

      {/* <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DebugProps />
      </ErrorBoundary> */}
    </div>
  )
}

export { Parts }
