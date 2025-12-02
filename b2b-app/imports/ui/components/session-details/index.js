import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { SessionDetailsProvider } from './context'
import DetailsHeader from './header'
import DetailsMap from './map'
import DetailsContent from './content'
import DetailsMembers from './members'

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
