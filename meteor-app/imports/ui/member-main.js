import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Grid, Button } from 'semantic-ui-react'
import { Session } from 'meteor/session'

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
  props.location.pathname === '/kiosk' && !props.isLogged ? Session.set('mode', 'kiosk') : Session.set('mode', 'normal')

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
    <Grid>
      <Grid.Row>
        <Grid.Column width="13">
          {props.location.pathname.match(/kiosk/) && (
            <Button type="button" onClick={registerClick} color="orange">
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
        </Grid.Column>

        <Grid.Column
          width="3"
          style={{
            position: 'fixed',
            top: '70px',
            right: '0',
            bottom: '0',
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'rgb(238, 238, 238)',
            overflowY: 'scroll'
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
        </Grid.Column>
      </Grid.Row>
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
