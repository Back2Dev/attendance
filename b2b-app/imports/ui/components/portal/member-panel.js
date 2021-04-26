import React, { useContext } from 'react'
import styled from 'styled-components'

import { Paper } from '@material-ui/core'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Avatar from '/imports/ui/components/commons/avatar.js'
import Badges from '/imports/ui/components/commons/member-badges.js'

const StyledMemberPanel = styled(Paper)`
  padding: 20px;
  .avatar {
    float: left;
  }
  .name {
    float: left;
    height: 50px;
    font-size: 30px;
    padding: 5px 10px;
    margin: 10px;
    border: 1px solid;
  }
  .badge {
    float: left;
    margin: 10px;
    img {
      height: 50px;
    }
  }
  .clr {
    clear: left;
  }
`

function MemberPanel() {
  const { member } = useContext(AccountContext)

  if (!member) {
    return null
  }

  const { name, nickname, avatar, badges } = member

  return (
    <StyledMemberPanel elevation={1}>
      <div className="avatar">
        <Avatar url={avatar} alt={nickname || name} size={120} />
      </div>
      <div className="name">{nickname || name}</div>
      <Badges badges={badges} />
      <div className="clr" />
    </StyledMemberPanel>
  )
}

export default MemberPanel
