import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Box, Button, Grid } from '@mui/material'
import context from '/imports/ui/utils/nav'

import MemberList from '/imports/ui/member/member-list'
import MemberCardSmall from '/imports/ui/member/member-card-small'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberCardSmallLoading from '/imports/ui/member/member-card-small-loading'
import MemberSearch from '/imports/ui/member/member-search-container'
import MemberCounter from '/imports/ui/member/member-counter'
import './member-main.css'

const memberWords = 'Volunteers'

const MemberMain = props => {
  props.location.pathname === '/kiosk' && !props.isLogged ? context.set('mode', 'kiosk') : context.set('mode', 'normal')

  const onCardClick = member => {
    let action = member.pin ? 'arrive' : 'create-pin'
    if (member.pin === '----') action = 'select-activity'
    if (member.isHere) action = member.pin === '----' ? 'sign-out' : 'depart'
    props.history.push(`/visit/${member._id}/${action}`)
  }

  const registerClick = e => {
    props.history.push(`/add`)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        {props.location.pathname.match(/kiosk/) && (
          <Button
            type="button"
            onClick={registerClick}
            color="warning"
            variant="contained"
            sx={{ mb: 1 }}
          >
            Register
          </Button>
        )}
        &nbsp;
        <MemberSearch memberWords={memberWords} />
        <MemberList
          title={'Check In:'}
          members={props.membersOut}
          Component={MemberCard}
          list="away"
          componentClassName="member-card-main"
          onCardClick={onCardClick}
          loading={props.loading}
          Loader={MemberCardLoading}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Box
          sx={{
            position: { md: 'fixed', xs: 'relative' },
            top: { md: 70, xs: 'auto' },
            right: { md: 0, xs: 'auto' },
            bottom: { md: 0, xs: 'auto' },
            textAlign: 'center',
            p: 2,
            backgroundColor: 'rgb(238, 238, 238)',
            overflowY: 'auto',
            width: { md: 260 }
          }}
        >
          <MemberList
            title={"Who's Here:"}
            members={props.membersIn}
            Component={MemberCardSmall}
            list="present"
            onCardClick={onCardClick}
            loading={props.loading}
            Loader={MemberCardSmallLoading}
          >
            <MemberCounter count={props.membersIn.length} />
          </MemberList>
        </Box>
      </Grid>
    </Grid>
  )
}

MemberList.propTypes = {
  loading: PropTypes.bool,
  membersIn: PropTypes.array.isRequired,
  membersOut: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(MemberMain)
