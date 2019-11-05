import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'

import MemberList from '/imports/ui/member/member-list'
import MemberCardSmall from '/imports/ui/member/member-card-small'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberCardSmallLoading from '/imports/ui/member/member-card-small-loading'
import MemberSearch from '/imports/ui/member/member-search-container'
import MemberCounter from '/imports/ui/member/member-counter'
import './member-main.css'

const memberWords = 'Volunteers'

class MemberMain extends React.Component {
  onCardClick = member => {
    let action = member.pin ? 'arrive' : 'create-pin'
    if (member.pin === '----') action = 'select-activity'
    if (member.isHere) action = member.pin === '----' ? 'sign-out' : 'depart'
    this.props.history.push(`/visit/${member._id}/${action}`)
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width="13">
            <MemberSearch memberWords={memberWords} />
            <MemberList
              title={'Check In:'}
              members={this.props.membersOut}
              Component={MemberCard}
              list="away"
              componentClassName="member-card-main"
              onCardClick={this.onCardClick}
              loading={this.props.loading}
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
              members={this.props.membersIn}
              Component={MemberCardSmall}
              list="present"
              onCardClick={this.onCardClick}
              loading={this.props.loading}
              Loader={MemberCardSmallLoading}
            >
              <MemberCounter count={this.props.membersIn.length} />
            </MemberList>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

MemberList.propTypes = {}

export default withRouter(MemberMain)
