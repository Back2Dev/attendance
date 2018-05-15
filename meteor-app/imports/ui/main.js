import React from 'react'
import MemberList from './member/member-list'
import { Grid } from 'semantic-ui-react'

const MemberMain = (props) => {
  return (
    <Grid>
      <Grid.Column width={12}>
        <MemberList title={'Check In:'} members={props.membersOut} />
      </Grid.Column>
      <Grid.Column width={4}>
        <MemberList title={'Who\'s Here:'} members={props.membersIn} />
      </Grid.Column>
    </Grid>
  )
}

export default MemberMain
