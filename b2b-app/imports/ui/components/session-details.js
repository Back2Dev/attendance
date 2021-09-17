import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { SessionDetailsProvider } from './session-details/context'
import DetailsHeader from './session-details/header'
import DetailsMap from './session-details/map'
import DetailsContent from './session-details/content'
import DetailsMembers from './session-details/members'

const StyledSessionDetails = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
`

function SessionDetails() {
  const { id } = useParams()
  console.log(id)
  return (
    <StyledSessionDetails>
      <SessionDetailsProvider>
        {/* <DetailsHeader /> */}
        {/* <DetailsMap /> */}
        <DetailsContent />
        <DetailsMembers />
      </SessionDetailsProvider>
    </StyledSessionDetails>
  )
}

export default SessionDetails
