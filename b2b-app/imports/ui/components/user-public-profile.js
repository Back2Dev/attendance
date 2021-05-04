import React from 'react'
import styled from 'styled-components'

import { PublicProfileProvider } from '/imports/ui/components/user-public-profile/context.js'
import Profile from './user-public-profile/profile'

const StyledPublicProfile = styled.div``

function PublicProfile() {
  return (
    <StyledPublicProfile>
      <PublicProfileProvider>
        <Profile />
      </PublicProfileProvider>
    </StyledPublicProfile>
  )
}

export default PublicProfile
