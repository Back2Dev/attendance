import React, { useContext } from 'react'
import styled from 'styled-components'

import { Grid, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

import { PublicProfileContext } from '/imports/ui/components/user-public-profile/context.js'
import Avatar from '/imports/ui/components/commons/avatar.js'
import Badges from '/imports/ui/components/commons/member-badges.js'

const StyledProfile = styled.div`
  .col-1,
  .col-2,
  .col-3 {
    padding: 10px 10px;
  }
  .col-1 {
    .title {
    }
  }
  .favorites {
    .tag {
      display: inline-block;
      margin-right: 20px;
    }
  }
`

function Profile() {
  const { loading, member } = useContext(PublicProfileContext)

  if (loading) {
    return (
      <StyledProfile>
        <Grid container>
          <Grid item xs={12} sm={5} md={4} className="col-1" align="center">
            <Skeleton variant="circle" width={150} height={150} className="avatar" />
            <Skeleton variant="rect" height={100} />
          </Grid>
          <Grid item xs={12} sm={7} md={5} className="col-2">
            <Skeleton variant="text" className="title" height={40} />
            <Skeleton variant="rect" height={200} />
          </Grid>
          <Grid item xs={12} sm={12} md={3} className="col-3">
            <Skeleton variant="rect" />
          </Grid>
        </Grid>
      </StyledProfile>
    )
  }

  return (
    <StyledProfile>
      <Grid container>
        <Grid item xs={12} sm={5} md={4} className="col-1" align="center">
          <div className="avatar">
            <Avatar url={member.avatar} alt={member.nickname || member.name} size={120} />
          </div>
          <div className="favorites">
            {member.favorites?.map((tag) => (
              <div className="tag" key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={12} sm={7} md={5} className="col-2">
          <Typography variant="h1" className="title">
            About {member?.name}
          </Typography>
          <div className="bio">{member.bio}</div>
        </Grid>
        <Grid item xs={12} sm={12} md={3} className="col-3">
          <Badges badges={member.badges} />
        </Grid>
      </Grid>
    </StyledProfile>
  )
}

export default Profile
