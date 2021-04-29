import React, { useContext } from 'react'
import styled from 'styled-components'

import { Typography, Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Loading from '/imports/ui/components/commons/loading.js'
import Avatar from '/imports/ui/components/commons/avatar.js'
import { SessionDetailsContext } from './context'

const StyledDetailsHeader = styled.div`
  .coach {
    display: flex;
    align-content: center;
    align-items: center;
    font-size: 1.5rem;
  }
  .avatar {
    margin-left: 10px;
  }
`

function DetailsHeader() {
  const { session, loading, coach } = useContext(SessionDetailsContext)

  if (loading) {
    return <Loading loading />
  }

  const renderTitle = () => {
    if (!session) {
      return <Skeleton variant="text" />
    }
    return session.name
  }

  const renderCoach = () => {
    if (!coach) {
      return <Skeleton variant="text" />
    }
    let avatarUrl = null
    if (coach.avatar) {
      if (/^http/.test(coach.avatar)) {
        avatarUrl = coach.avatar
      } else {
        avatarUrl = `/images/avatar/${coach.avatar}`
      }
    }
    return (
      <>
        Coach: {coach.name} <Avatar url={avatarUrl} alt={coach.name} size={32} />
      </>
    )
  }

  return (
    <StyledDetailsHeader>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Typography variant="h1" className="session-name">
            {renderTitle()}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6} className="coach">
          {renderCoach()}
        </Grid>
      </Grid>
    </StyledDetailsHeader>
  )
}

export default DetailsHeader
