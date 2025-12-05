import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@mui/material'

import Portal from '/imports/ui/components/portal.js'
import UserPreferences from '/imports/ui/components/user-preferences/user-preferences.js'
import PublicProfile from '/imports/ui/components/user-public-profile.js'

const StyledUserPage = styled.div``

function UserPage() {
  return (
    <StyledUserPage>
      <Helmet>
        <title>Member</title>
      </Helmet>
      <Container maxWidth="lg">
        <Routes>
          <Route path=":id" element={<PublicProfile />} />
          <Route index element={<UserPreferences />} />
          <Route path="*" element={<Portal />} />
        </Routes>
      </Container>
    </StyledUserPage>
  )
}

export default UserPage
