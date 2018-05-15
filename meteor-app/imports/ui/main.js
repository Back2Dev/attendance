import React from 'react'
import MemberList from './member/member-list'
import MemberListIn from './member/member-list-in'
import { Grid } from 'semantic-ui-react'

const MemberMain = (props) => {
  return (
    <div>
      <MemberList title={'Check In:'} members={props.membersOut} />


      <MemberListIn title={'Who\'s Here:'} members={props.membersIn} />

    </div>

  )
}

export default MemberMain
