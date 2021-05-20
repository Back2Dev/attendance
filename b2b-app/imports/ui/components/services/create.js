import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

const StyledCreateService = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

function CreateService() {
  return (
    <StyledCreateService>
      <Typography variant="h1" align="center">
        New Service
      </Typography>
    </StyledCreateService>
  )
}

export default CreateService
