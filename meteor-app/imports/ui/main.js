import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom'
import { Session } from 'meteor/session'
import MemberList from '/imports/ui/member/member-list'
import MemberCardSmall from '/imports/ui/member/member-card-small'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberCardSmallLoading from '/imports/ui/member/member-card-small-loading'
import Search from '/imports/ui/member/member-search'
import { Menu } from 'semantic-ui-react'

class MemberMain extends React.Component {

  onCardClick = (id) => {
    this.props.history.push(`/${id}`)
  }

  render() {
    return (
      <Fragment>
        <div style={{ margin: '80px 0 150px' }}>
          <MemberList
            title={'Check In:'}
            members={this.props.membersOut}
            Component={MemberCard}
            onCardClick={this.onCardClick}
            loading={this.props.loading}
            Loader={MemberCardLoading}
          >
            <Search
              onSearchInput={this.props.onSearchInput}
            />
          </MemberList>
        </div>
        <MemberList
          style={{
            position: 'fixed',
            zIndex: '999',
            backgroundColor: '#eee',
            bottom: '0',
            left: '0',
            right: '0',
            height: '80px',
            padding: '0 20px',
            textAlign: 'center',
          }}
          title={'Who\'s Here:'}
          members={this.props.membersIn}
          Component={MemberCardSmall}
          onCardClick={this.onCardClick}
          loading={this.props.loading}
          Loader={MemberCardSmallLoading}
        />
      </Fragment>
    )
  }
}


MemberList.propTypes = {
};

export default withRouter(MemberMain)
