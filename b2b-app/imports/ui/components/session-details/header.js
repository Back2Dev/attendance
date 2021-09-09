import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

import { Typography, Grid, Link } from '@material-ui/core'
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

    .coach-member {
      display: flex;
    }
  }
  .avatar {
    margin-right: 10px;
  }
`

function DetailsHeader() {
  const { session, loading, event, course } = useContext(SessionDetailsContext)
  // find the coach(es) from list of event members
  const coaches = useMemo(() => {
    const coachMembers = []
    if (!event || !event.members.length) {
      return coachMembers
    }
    event.members.map((item) => {
      if (item.session.role === 'COA') {
        coachMembers.push(item)
      }
    })
    return coachMembers
  }, [event?.members])

  if (loading) {
    return <Loading loading />
  }

  const renderTitle = () => {
    if (!session) {
      return <Skeleton variant="text" />
    }
    return session.name
  }

  const renderCoaches = () => {
    if (!coaches || !coaches.length) {
      return null
    }
    return coaches.map((coach) => {
      let avatarUrl = null
      if (coach.avatar) {
        if (/^http/.test(coach.avatar)) {
          avatarUrl = coach.avatar
        } else {
          avatarUrl = `/images/avatar/${coach.avatar}`
        }
      }
      const profileUrl = `/profile/${coach._id}`
      return (
        <div key={coach._id} className="coach-member">
          Coach:&nbsp;
          <Avatar url={avatarUrl} alt={coach.name} size={32} linkUrl={profileUrl} />
          <Link component={RouterLink} to={profileUrl}>
            {coach.name}
          </Link>{' '}
        </div>
      )
    })
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
          {renderCoaches()}
        </Grid>
      </Grid>
    </StyledDetailsHeader>
  )
}

export default DetailsHeader
