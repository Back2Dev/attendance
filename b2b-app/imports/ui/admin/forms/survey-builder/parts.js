import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'

import { Box } from '@material-ui/core'
import DebugProps from './inspector/debug-props'
import debug from 'debug'
import { useParts, useSetSelectedPart } from './recoil/hooks'
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
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
      <button onClick={() => addPart('single')}>Single</button>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DebugProps />
      </ErrorBoundary>
    </Box>
  )
}

export default Parts
