import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import MemberList from '/imports/ui/member/member-list'
import MemberCardSmall from '/imports/ui/member/member-card-small'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberCardSmallLoading from '/imports/ui/member/member-card-small-loading'
import { Grid } from 'semantic-ui-react'
import MemberCounter from '/imports/ui/member/member-counter'
import '/imports/ui/member-main.css'

class MemberMain extends React.Component {

  onCardClick = (id) => {
    this.props.history.push(`/${id}`)
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width='13'>
            <MemberList
              title={'Check In:'}
              members={this.props.membersOut}
              Component={MemberCard}
              componentClassName='member-card-main'
              onCardClick={this.onCardClick}
              loading={this.props.loading}
              Loader={MemberCardLoading}
            />
          </Grid.Column>

          <Grid.Column
            width='3'
            style={{
              position: 'fixed',
              top: '70px',
              right: '0',
              bottom: '0',
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgb(238, 238, 238)',
              overflowY: 'scroll',
            }}
          >
            <MemberList
              title={'Who\'s Here:'}
              members={this.props.membersIn}
              Component={MemberCardSmall}
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


MemberList.propTypes = {
};

export default withRouter(MemberMain)
