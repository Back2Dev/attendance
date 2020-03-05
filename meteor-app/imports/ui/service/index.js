import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

const ServiceAdd = props => {
  return <div>{!props.loading ? props.serviceItems.map(item => <h1>{item.name}</h1>) : <h1>hahaha</h1>}</div>
}

ServiceAdd.propTypes = {
  setAssessment: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default withRouter(ServiceAdd)
