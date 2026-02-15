import React from 'react'
import ErrorBoundary from '/imports/ui/error-boundary'
import WebformUniforms from './form-run-uniforms'

export default WebformRun = (props) => (
  <ErrorBoundary>
    <WebformUniforms {...props} />
  </ErrorBoundary>
)
