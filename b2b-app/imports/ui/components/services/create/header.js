import React, { useContext } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import { Typography } from '@mui/material'

import { ServiceContext } from './context'

const StyledCreateServiceHeader = styled.div``

function CreateServiceHeader() {
  const { jobId, steps } = useContext(ServiceContext)

  const renderHeaderText = () => {
    const totalCost = (steps?.service?.data?.totalCost || 0) / 100

    return jobId ? `Edit Service $${totalCost}` : `New Service $${totalCost}`
  }

  return (
    <StyledCreateServiceHeader>
      <Helmet>
        <title>{renderHeaderText()}</title>
      </Helmet>
      <Typography variant="h1" align="center" id="service-total">
        {renderHeaderText()}
      </Typography>
    </StyledCreateServiceHeader>
  )
}

export default CreateServiceHeader
