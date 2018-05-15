import React from 'react'
import PropTypes from 'prop-types';
import { List, Header } from 'semantic-ui-react'
import MemberCardIn from './member-card-in'

const MemberListIn = (props) => {
  const { members, title } = props
  return (
    //renders list of users signed in OR out
    <div
      style={{
        position: 'fixed',
        zIndex: '999',
        backgroundColor: 'white',
        bottom: '0',
        left: '0',
        right: '0',
        height: '15vh',
        padding: '20px',
        border: '1px solid red',
      }}
    >
      <Header
        as={'h2'}
        content={title}
      />

      <List horizontal verticalAlign={'middle'} style={{height: '50px', margin: '0'}}>
        {
          members.map(member => (
            <MemberCardIn key={member._id} {...member} />
          ))
        }
      </List>
    </div>
  )
}

MemberListIn.propTypes = {
  members: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default MemberListIn