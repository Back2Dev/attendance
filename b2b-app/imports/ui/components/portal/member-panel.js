import React, { useContext } from 'react'
import styled from 'styled-components'

import { Paper } from '@material-ui/core'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Avatar from '/imports/ui/components/commons/avatar.js'
import PopoverUtil from '/imports/ui/components/commons/popover.js'

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

  const { name, nickname, avatar } = member

  return (
    <StyledMemberPanel elevation={1}>
      <div className="avatar">
        <Avatar url={avatar} alt={nickname || name} size={120} />
      </div>
      <div className="name">{nickname || name}</div>
      <div className="badge">
        <PopoverUtil popContent="You have gmail">
          <img src="/badges/google.jpg" alt="google" />
        </PopoverUtil>
      </div>
      <div className="badge">
        <PopoverUtil popContent="It looks like you have credit card">
          <img src="/badges/card.png" alt="card" />
        </PopoverUtil>
      </div>
      <div className="badge">
        <PopoverUtil popContent="Some star description">
          <img src="/badges/star.png" alt="star" />
        </PopoverUtil>
      </div>
      <div className="clr" />
    </StyledMemberPanel>
  )
}

export default MemberPanel
