import React from 'react'
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react'
import MemberCard from './member-card'

const MemberList = (props) => {
  const { members, title, cardsPerRow } = props
  return (
    //renders list of users signed in OR out
    <div>
      <h1>{title}</h1>
      <Card.Group itemsPerRow={cardsPerRow}>
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
  cardsPerRow: PropTypes.number.isRequired,
};

export default MemberList