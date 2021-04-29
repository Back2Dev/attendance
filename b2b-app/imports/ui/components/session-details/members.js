import React, { useContext } from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'
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
  const { loading, members } = useContext(SessionDetailsContext)

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

  if (!members || !members.length) {
    return null
  }

  const renderMember = (member) => {
    return (
      <div className="member-container" key={member._id}>
        <Avatar url={member.avatar} size={32} alt={member.name} />
        <div className="name">{member.name}</div>
        <div className="badges">
          <Badges badges={member.badges} />
        </div>
      </div>
    )
  }

  return (
    <StyledDetailsMembers>
      <Typography variant="h2">Attending</Typography>
      {members.map((member) => renderMember(member))}
    </StyledDetailsMembers>
  )
}

export default DetailsMembers
