import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { SessionDetailsProvider } from './session-details/context'

const StyledSessionDetails = styled.div``

function SessionDetails() {
  const { id } = useParams()
  console.log(id)
  return (
    <StyledSessionDetails>
      <SessionDetailsProvider>
        <Typography variant="h1">SessionDetails</Typography>
      </SessionDetailsProvider>
    </StyledSessionDetails>
  )
}

export default SessionDetails
