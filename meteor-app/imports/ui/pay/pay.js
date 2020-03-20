import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header } from 'semantic-ui-react'

const Payment = ({ job }) => {
  if (!job) return <h3>Job not found</h3>
  return (
    <Container>
      <Header as="h2" textAlign="center">
        Pay {job.jobNo}
      </Header>
    </Container>
  )
}

Payment.propTypes = {
  job: PropTypes.object.isRequired
}

export default Payment
