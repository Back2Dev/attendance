import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Session } from 'meteor/session'
import MemberList from '/imports/ui/member/member-list'
import MemberCardSmall from '/imports/ui/member/member-card-small'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import Search from '/imports/ui/member/member-search'
import { Menu } from 'semantic-ui-react'

class MemberMain extends React.Component {
  
  onCardClick = (id) => {
    this.props.history.push(`/${id}`)
  }

  render() {
    return (
      <Fragment>
        <div style={{ paddingBottom: '20vh' }}>
          <MemberList
            title={'Check In:'}
            members={this.props.membersOut}
            Component={MemberCard}
            onCardClick={this.onCardClick}
            loading={this.props.loading}
            Loader={MemberCardLoading}
          >
            <Menu>
              <Menu.Item as={Link} to='/add'>
                New Volunteer
            </Menu.Item>
              <Menu.Item position='right'>
                <Search
                  onSearchInput={this.props.onSearchInput}
                />
              </Menu.Item>
            </Menu>
          </MemberList>
        </div>
        <MemberList
          style={{
            position: 'fixed',
            zIndex: '999',
            backgroundColor: 'white',
            bottom: '0',
            left: '0',
            right: '0',
            height: '20vh',
            padding: '0 20px 10px',
            textAlign: 'center',
          }}
          title={'Who\'s Here:'}
          members={this.props.membersIn}
          Component={MemberCardSmall}
          onCardClick={this.onCardClick}
          loading={this.props.loading}
          Loader={MemberCardLoading}
        />
      </Fragment>
    )
  }
}


export default withRouter(MemberMain)
