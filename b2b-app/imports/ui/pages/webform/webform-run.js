import React from 'react'
import ErrorBoundary from '/imports/ui/error-boundary'
import WebformUiSchema from './webform-ui-schema'
import WebformUniforms from './webform-uniforms'

export default WebformRun = (props) => (
  <ErrorBoundary>
    <WebformUniforms {...props} />
  </ErrorBoundary>
)
