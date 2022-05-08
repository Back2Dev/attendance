import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'

import { DebugProps } from '../inspector/debug-props'
import debug from 'debug'
import {
  useParts,
  useSetSelectedPart,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
const log = debug('builder:parts')

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

const Parts = () => {
  const { addPart } = useParts()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div>
      <button onClick={() => addPart('single')}>Single</button>
      <button onClick={() => addPart('upload')}>Upload</button>
      <button onClick={() => addPart('multiple')}>Multiple</button>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DebugProps />
      </ErrorBoundary>
    </div>
  )
}

export { Parts }
