import React, { useContext } from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { ServiceContext } from './context'

const StyledCreateServiceHeader = styled.div``

function CreateServiceHeader() {
  const { jobId } = useContext(ServiceContext)

  const renderHeaderText = () => {
    return jobId ? 'Edit Service' : 'New Service'
  }

  return (
    <StyledCreateServiceHeader>
      <Typography variant="h1" align="center">
        {renderHeaderText()}
      </Typography>
    </StyledCreateServiceHeader>
  )
}

export default CreateServiceHeader
