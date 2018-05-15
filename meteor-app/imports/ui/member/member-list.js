import React from 'react'
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react'
import MemberCard from './member-card'

const MemberList = (props) => {
  const { members, title } = props
  return (
    //renders list of users signed in OR out
    <div style={{paddingBottom: '20vh'}}>
      <h1>{title}</h1>
      <Card.Group centered>
        {
          members.map(member => (
            <MemberCard key={member._id} {...member} />
          ))
        }
      </Card.Group>
    </div>
  )
}

MemberList.propTypes = {
  members: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default MemberList