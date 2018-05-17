import React from 'react'
import PropTypes from 'prop-types';
import { Card, Header } from 'semantic-ui-react'

const MemberList = (props) => {
  const { members, title, Component, style, onCardClick } = props
  return (
    //renders list of users signed in OR out
    <div style={style}>
      <Header
        dividing
        as={'h1'}
        textAlign={'center'}
        content={title}
      />
      <Card.Group centered>
        {
          members.map(member => (
            <Component key={member._id} {...member} onCardClick={onCardClick}/>
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