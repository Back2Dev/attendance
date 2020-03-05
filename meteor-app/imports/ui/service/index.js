import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Service from './service'

const ServiceAdd = props => {
  return (
    <div>
      <Service />
    </div>
  )
}

ServiceAdd.propTypes = {
  setAssessment: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default withRouter(ServiceAdd)
