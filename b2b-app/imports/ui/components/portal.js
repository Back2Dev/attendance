import React from 'react'
import styled from 'styled-components'

import { Typography, Grid } from '@material-ui/core'

import { MySessionsProvider } from './portal/contexts'
import MemberPanel from './portal/member-panel'
import RecentSessions from './portal/recent'
import UpcomingSessions from './portal/upcoming'

const StyledMemberPortal = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
  .sessions-wrapper {
    margin: 40px 0;
  }
  ${({ theme }) => `
    ${theme.breakpoints.up('sm')} {
      .recent-sessions-wrapper {
        padding-right: 10px;
      }
      .upcoming-sessions-wrapper {
        padding-left: 10px;
      }
    }
  `}
`

function MemberPortal() {
  return (
    <StyledMemberPortal>
      <Typography variant="h1" align="center">
        Member Portal
      </Typography>
      <div className="member-panel-wrapper">
        <MemberPanel />
      </div>
      <MySessionsProvider>
        <Grid container className="sessions-wrapper">
          <Grid item xs={12} sm={6} className="recent-sessions-wrapper">
            <UpcomingSessions />
          </Grid>
          <Grid item xs={12} sm={6} className="upcoming-sessions-wrapper">
            <RecentSessions />
          </Grid>
        </Grid>
      </MySessionsProvider>
    </StyledMemberPortal>
  )
}

export default MemberPortal
