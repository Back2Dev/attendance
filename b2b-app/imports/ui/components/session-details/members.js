import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

import { Typography, Link } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Avatar from '/imports/ui/components/commons/avatar.js'
import Badges from '/imports/ui/components/commons/member-badges.js'
import { SessionDetailsContext } from './context'

const StyledDetailsMembers = styled.div`
  margin-top: 20px;
  .member-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .name {
      margin-left: 10px;
      font-size: 1.1rem;
    }
    .badges {
      margin-left: 10px;
      .badge {
        margin: 5px;
        img {
          height: 32px;
        }
      }
    }
  }
`

function DetailsMembers() {
  const { loading, event } = useContext(SessionDetailsContext)

  if (loading) {
    return (
      <StyledDetailsMembers>
        <div>
          <Skeleton variant="circle" size={32} />
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={150} />
        </div>
      </StyledDetailsMembers>
    )
  }

  if (!event || !event.members || !event.members.length) {
    return null
  }

  const renderMember = (member) => {
    const profileUrl = `/profile/${member._id}`
    return (
      <div className="member-container" key={member._id}>
        <Avatar url={member.avatar} size={32} alt={member.name} linkUrl={profileUrl} />
        <div className="name">
          <Link component={RouterLink} to={profileUrl}>
            {member.name}
          </Link>
        </div>
        <div className="badges">
          <Badges badges={member.badges} />
        </div>
      </div>
    )
  }

  return (
    <StyledDetailsMembers>
      <Typography variant="h2">Attending</Typography>
      {event.members.map((member) => renderMember(member))}
    </StyledDetailsMembers>
  )
}

export default DetailsMembers
